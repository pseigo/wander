/*
 * Copyright (c) 2025 Peyton Seigo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { clsx } from "clsx";
import { useState, useEffect, useRef } from "react";
import ML from "maplibre-gl";

import { randomLowerAlphaNumericString } from "/wander/common/strings";

import * as MapLibre from "/wander/maps/maplibre";
import { CAFES } from "/wander/maps/maplibre/constants";
import { PanelGroup } from "/wander/maps/panels/panel_group";
import { PointerPositionPanel } from "/wander/maps/panels/pointer_position_panel";
import { ZoomLevelPanel } from "/wander/maps/panels/zoom_level_panel";

const initialCenter = { longitude: -114.0716, latitude: 51.0428 };
const initialZoomLevel = 13;

export function MapLibreMap() {
  const mapNodeId = useRef(`MapLibreMap-${randomLowerAlphaNumericString()}`);
  const mapRef = useRef(null);
  const [pointerPosition, setPointerPosition] = useState(initialCenter);
  const [zoomLevel, setZoomLevel] = useState(initialZoomLevel);

  useEffect(() => {
    const map = MapLibre.createMap(
      mapNodeId.current,
      initialCenter,
      initialZoomLevel
    );
    mapRef.current = map;

    // Data
    map.on("load", async () => {
      MapLibre.addSources(map);
      await MapLibre.addImages(map);
      MapLibre.addLayers(map);
    });

    // Interaction
    // prettier-ignore
    {
      map.on("click", CAFES.iconLayerId, (e) => console.log("clicked", e));
      map.on("touchstart", CAFES.iconLayerId, (e) => console.log("touchstart", e));
      map.on("touchend", CAFES.iconLayerId, (e) => console.log("touchend", e));
    }

    // Map state for debug panels
    map.on("mousemove", (e) => {
      const longitude = e.lngLat["lng"];
      const latitude = e.lngLat["lat"];
      setPointerPosition({ longitude: longitude, latitude: latitude });
    });
    map.on("zoom", (_e) => {
      const zoomLevel = map.getZoom();
      setZoomLevel(zoomLevel);
    });

    return () => {
      MapLibre.deleteMap(mapRef.current);
      mapRef.current = null;
    };
  }, []);

  return (
    // prettier-ignore
    <div className="h-full static z-0">
      <PanelGroup position="bottom-left" stack="vertical">
        <PointerPositionPanel position={pointerPosition} />
        <ZoomLevelPanel zoomLevel={zoomLevel} />
      </PanelGroup>

      <div id={mapNodeId.current} className={clsx([
        "h-full",
        "bg-gray-300"
      ])}></div>
    </div>
  );
}
