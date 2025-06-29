/*
 * Copyright (c) 2025 Peyton Seigo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";

import { randomLowerAlphaNumericString } from "tanaris/strings";
import * as Config from "/wander/common/config";

import * as MapLibre from "/wander/maps/maplibre";
import { CAFES } from "/wander/maps/maplibre/constants";
import { sampleCafe } from "/wander/maps/maplibre/sources";
import { PanelGroup } from "/wander/maps/panels/panel_group";
import { PointerPositionPanel } from "/wander/maps/panels/pointer_position_panel";
import { ZoomLevelPanel } from "/wander/maps/panels/zoom_level_panel";
import { BearingPanel } from "/wander/maps/panels/bearing_panel";
import { PitchPanel } from "/wander/maps/panels/pitch_panel";
import { FeatureSheet } from "/wander/maps/feature_sheet";
import {
  FeatureSheetDebugPanel,
  useFeatureSheetDebugInfo,
} from "/wander/maps/panels/feature_sheet_debug_panel";

import { useLiveSourceData } from "./maplibre_map/live_source_data";

const initialCenter = { longitude: -114.0716, latitude: 51.0428 };
const initialZoomLevel = 15;

/**
 * When a Map click event fires and no layer click event is observed within
 * this time (before or after as I'm not sure if the library guarantees order),
 * we assume that the layer (determined by the callsite of this constant) was
 * _not_ clicked.
 *
 * This is hacky. Would be happy to know if the map library offers a way to
 * determine if a map click was _not_ on one or more particular layers without
 * numerous potential timing bugs.
 */
const k_mapClickConsideredOutsideLayerAfterMillis = 10;
const sampleFeature = sampleCafe();

export function MapLibreMap({ cafes }) {
  const mapNodeId = useRef(`MapLibreMap-${randomLowerAlphaNumericString()}`);
  const mapRef = useRef(null);

  const [pointerPosition, setPointerPosition] = useState(initialCenter);
  const [zoomLevel, setZoomLevel] = useState(initialZoomLevel);
  const [bearing, setObservedBearing] = useState(0);
  const [pitch, setObservedPitch] = useState(0);

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [clickedAt, setClickedAt] = useState({ map: null, layer: null });
  const mapClickConsideredOutsideLayerTimerRef = useRef(null);

  const [getSheetDebugInfoSetters, sheetDY, sheetHeaderHeight] =
    useFeatureSheetDebugInfo();

  const [mapIsLoaded, setMapIsLoaded] = useState(false);

  useEffect(() => {
    const map = MapLibre.createMap(
      mapNodeId.current,
      initialCenter,
      initialZoomLevel
    );
    mapRef.current = map;

    registerDataLoadListener(map, setMapIsLoaded);
    registerInteractionListeners(
      map,
      setSelectedFeature,
      setClickedAt,
      mapClickConsideredOutsideLayerTimerRef
    );
    registerDebugInfoStateUpdaters(
      map,
      setPointerPosition,
      setZoomLevel,
      setObservedBearing,
      setObservedPitch
    );

    return () => {
      MapLibre.deleteMap(mapRef.current);
      mapRef.current = null;
    };
  }, []);

  useLiveSourceData(mapRef, mapIsLoaded, cafes);

  useEffect(() => {
    if (clickedAt.map === null && clickedAt.layer === null) {
      // Cleared after both events fired. (Or mounting.)
      return;
    }

    if (clickedAt.map === null || clickedAt.layer === null) {
      // Either `clickedAt.map` or `clickedAt.millis` is null but not both.
      // Waiting for other event to fire. (Or its state update to go through.)
      return;
    }

    // Now, both `clickedAt.map` and `clickedAt.layer` are non-null.

    // Clear timer
    if (mapClickConsideredOutsideLayerTimerRef.current !== null) {
      clearTimeout(mapClickConsideredOutsideLayerTimerRef.current);
      mapClickConsideredOutsideLayerTimerRef.current = null;
    }

    /*
    if (clickedAt.map >= clickedAt.layer) {
      // Map event queued a state update first.
      const dtMillis = clickedAt.map - clickedAt.layer;
      console.log(
        `[map clicked] event fired ${dtMillis}ms after layer click event`
      );
    } else {
      // Layer event queued a state update first.
      const dtMillis = clickedAt.layer - clickedAt.map;
      console.log(
        `[layer clicked] event fired ${dtMillis}ms after map click event`
      );
    }
    */

    setClickedAt({ map: null, layer: null });
  }, [clickedAt]);

  useGlobalConfig(mapRef);

  return (
    <div className="h-full static z-0">
      {Config.get("enabled", "debug") && (
        <>
          <PanelGroup position="bottom-left" stack="vertical">
            {Config.get("map.panels.pointer_position", "debug") && (
              <PointerPositionPanel position={pointerPosition} />
            )}
            {Config.get("map.panels.zoom_level", "debug") && (
              <ZoomLevelPanel zoomLevel={zoomLevel} />
            )}
            {Config.get("map.panels.bearing", "debug") && (
              <BearingPanel bearing={bearing} />
            )}
            {Config.get("map.panels.pitch", "debug") && (
              <PitchPanel pitch={pitch} />
            )}
          </PanelGroup>
          <PanelGroup position="top-left" stack="vertical">
            {Config.get("map.panels.feature_sheet", "debug") && (
              <FeatureSheetDebugPanel
                dY={sheetDY}
                headerHeight={sheetHeaderHeight}
              />
            )}
          </PanelGroup>
        </>
      )}

      {Config.get("enabled", "debug") &&
      Config.get("map.override_selected_feature.enabled", "debug") ? (
        <FeatureSheet
          feature={sampleFeature}
          getDebugInfoSetters={getSheetDebugInfoSetters}
        />
      ) : (
        selectedFeature != null && (
          <FeatureSheet
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
            getDebugInfoSetters={getSheetDebugInfoSetters}
          />
        )
      )}

      <div
        id={mapNodeId.current}
        className={clsx(["h-full", "bg-gray-300"])}
      ></div>
    </div>
  );
}

function registerInteractionListeners(
  map,
  setSelectedFeature,
  setClickedAt,
  mapClickConsideredOutsideLayerTimerRef
) {
  map.on("mouseenter", CAFES.iconLayerId, (_e) => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", CAFES.iconLayerId, (_e) => {
    map.getCanvas().style.cursor = "";
  });

  map.on("click", (_e) => {
    //console.log("[map clicked]", e);
    //const rawFeatures = e.features;
    //console.log("[map clicked](cont'd)", rawFeatures);

    mapClickConsideredOutsideLayerTimerRef.current = setTimeout(() => {
      // Uncomment this line to clear the selected feature when the user
      // clicks/taps on the map.
      //
      // For now it's disabled because when it's on, if you have a feature
      // selected you can't double tap/click to zoom without closing the sheet.
      //setSelectedFeature(null);

      setClickedAt({ map: null, layer: null });
    }, k_mapClickConsideredOutsideLayerAfterMillis);

    setClickedAt((clickedAt) => {
      return { ...clickedAt, map: performance.now() };
    });
  });

  map.on("click", CAFES.iconLayerId, (e) => {
    //console.log("[layer clicked]", e);
    //console.log(
    //  `[layer clicked](cont'd) ${e.features.length} feature(s):`,
    //  e.features
    //);

    const rawFeature = e.features[0];
    const properties = rawFeature.properties;
    const id = properties["@id"];
    const geometry = rawFeature.geometry;
    const feature = { id: id, properties: properties, geometry: geometry };

    setSelectedFeature(feature);
    setClickedAt((clickedAt) => {
      return { ...clickedAt, layer: performance.now() };
    });
  });

  // TODO: touch events
  // map.on("touchstart", CAFES.iconLayerId, (e) => { ... });
  // map.on("touchmove", CAFES.iconLayerId, (e) => { ... });
  // map.on("touchend", CAFES.iconLayerId, (e) => { ... });
}

function registerDataLoadListener(map, setMapIsLoaded) {
  map.on("load", async () => {
    MapLibre.addSources(map);
    await MapLibre.addImages(map);
    MapLibre.addLayers(map);
    setMapIsLoaded(true);
  });
}

function registerDebugInfoStateUpdaters(
  map,
  setPointerPosition,
  setZoomLevel,
  setObservedBearing,
  setObservedPitch
) {
  map.on("mousemove", (e) => {
    const longitude = e.lngLat["lng"];
    const latitude = e.lngLat["lat"];
    setPointerPosition({ longitude: longitude, latitude: latitude });
  });
  map.on("zoom", (_e) => {
    const zoomLevel = map.getZoom();
    setZoomLevel(zoomLevel);
  });
  map.on("rotate", (_e) => {
    const bearing = map.getBearing();
    setObservedBearing(bearing);
  });
  map.on("pitch", (_e) => {
    const pitch = map.getPitch();
    setObservedPitch(pitch);
  });
}

function useGlobalConfig(mapRef) {
  useEffect(() => {
    const center = Config.get("map.initial.center") || [-93.2277, 44.974];
    const zoom = Config.get("map.initial.zoom") || 3.2;
    const bearing = Config.get("map.initial.bearing") || 0;
    const pitch = Config.get("map.initial.pitch") || 8;

    mapRef.current.on("load", () => {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(zoom);
      mapRef.current.setBearing(bearing);
      mapRef.current.setPitch(pitch);
    });
  }, []);
}
