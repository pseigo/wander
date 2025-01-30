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

import { useEffect } from "react";

import { CAFES } from "/wander/maps/maplibre/constants";

/**
 * @param {React.RefObject<ML.Map>} mapRef
 * @param {boolean} mapIsLoaded
 * @param {[object]} cafes
 */
export function useLiveSourceData(mapRef, mapIsLoaded, cafes) {
  /**
   * @see https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#getsource
   * @see https://maplibre.org/maplibre-gl-js/docs/API/interfaces/Source
   * @see https://maplibre.org/maplibre-gl-js/docs/API/classes/GeoJSONSource
   */
  useEffect(() => {
    if (mapIsLoaded !== true) {
      //console.log("[useCreateSourcesAndSyncData] (no-op) map not loaded yet.", mapIsLoaded, cafes.length);
      return;
    }
    //console.log("[useCreateSourcesAndSyncData] map loaded or cafes changed");

    const source = mapRef.current.getSource(CAFES.sourceName);

    if (source !== undefined) {
      //console.log("[useCreateSourcesAndSyncData] cafes changed - source exists, updating");
      updateSource(source, CAFES.sourceName, cafes);
    } else {
      //console.log("[useCreateSourcesAndSyncData] cafes changed - source is undefined, creating");
      createSource(mapRef, CAFES.sourceName, cafes);
    }
  }, [mapIsLoaded, cafes]);
}

/**
 * @see https://maplibre.org/maplibre-gl-js/docs/API/classes/GeoJSONSource/#setdata
 */
function updateSource(source, sourceName, features) {
  //console.log("[useCreateSourcesAndSyncData] updating source...");
  const featureCollection = createFeatureCollection(features);
  source.setData(featureCollection);
}

/**
 * @see https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#addsource
 */
function createSource(mapRef, sourceName, features) {
  //console.log("[useCreateSourcesAndSyncData] creating source...");
  const sourceSpec = createSourceSpec(features);
  mapRef.current.addSource(sourceName, sourceSpec);
}

/**
 * @see https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#addsource
 * @see https://maplibre.org/maplibre-style-spec/sources/#geojson
 */
function createSourceSpec(features) {
  const featureCollection = createFeatureCollection(features);
  const sourceSpec = {
    type: "geojson",
    data: featureCollection,
  };
  return sourceSpec;
}

/**
 * @see https://datatracker.ietf.org/doc/html/rfc7946#section-3.3
 */
function createFeatureCollection(features) {
  const featureCollection = {
    type: "FeatureCollection",
    features: features,
  };
  return featureCollection;
}
