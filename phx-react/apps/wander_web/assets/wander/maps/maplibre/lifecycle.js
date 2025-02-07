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

import ML from "maplibre-gl";
import { Protocol as PmtilesProtocol } from "pmtiles";

import { externalRasterStyle, externalVectorStyle, internalVectorStyle } from "/wander/maps/maplibre/styles";

/**
 * @param {string} nodeId
 * @param {{longitude: string, latitude: string} initialCenter
 * @param {number} initialZoomLevel
 *
 * @returns {ML.Map}
 */
export function createMap(nodeId, initialCenter, initialZoomLevel) {
  const pmtilesProtocol = new PmtilesProtocol();
  ML.addProtocol("pmtiles", pmtilesProtocol.tile);

  const map = new ML.Map({
    container: nodeId,

    //style: internalVectorStyle,
    style: externalVectorStyle,

    //transformRequest: transformRequest,

    attributionControl: {
      compact: false,
      customAttribution: "Map and Place Data &copy; OpenStreetMap, ODbL",
    },
    center: [initialCenter.longitude, initialCenter.latitude],
    zoom: initialZoomLevel,
  });

  if (map === null || map === undefined) {
    throw new Error("failed to create MapLibre map");
  }

  map.addControl(
    new ML.NavigationControl({
      visualizePitch: true,
      visualizeRoll: true,
      showZoom: true,
      showCompass: true,
    })
  );

  return map;
}

/**
 * @implements {ML.RequestTransformFunction}
 *
 * @param {string} url
 * @param {ML.ResourceType?} resourceType
 *
 * @returns {(ML.RequestParameters | undefined)}
 *
 * @see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/#transformrequest
 * @see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/RequestTransformFunction/
 * @see https://maplibre.org/maplibre-gl-js/docs/API/enumerations/ResourceType/
 * @see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/RequestParameters/
 */
function transformRequest(url, resourceType = null) {
  // [start] Example
  const prefix = "https://vector.openstreetmap.org/shortbread_v1/";

  if (resourceType === "Tile" && url.startsWith(prefix)) {
    // Return a `RequestParameters` object with your desired settings.
  }
  // [end] Example

  return undefined;
}

/**
 * @param {ML.Map} `map`
 */
export function deleteMap(map) {
  map.remove();
}
