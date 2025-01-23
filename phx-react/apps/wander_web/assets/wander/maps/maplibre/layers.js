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

import { CAFES } from "./constants";

/**
 * @param {ML.Map} map
 */
export function addLayers(map) {
  addCafeLayers(map);
}

/**
 * Creates and adds a GeoJSON layer to the `map`.
 *
 * @param {ML.Map} map
 *
 * @see https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-click/
 */
function addCafeLayers(map) {
  const iconLayer = cafeIconLayer();
  map.addLayer(iconLayer);

  const labelLayer = cafeLabelLayer();
  map.addLayer(labelLayer);
}

/**
 * Returns an `AddLayerObject` for café map icons.
 *
 * @see https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#addlayer
 * @see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/AddLayerObject/
 *
 * @returns {ML.AddLayerObject}
 */
function cafeIconLayer() {
  const layer = {
    id: CAFES.iconLayerId,
    // @see https://maplibre.org/maplibre-style-spec/layers/#type
    type: "symbol",
    source: CAFES.sourceName,
    layout: {
      "icon-image": "marker-small-4x",
      "icon-overlap": "always",
      "icon-size": 0.25,
    },
  };

  return layer;
}

/**
 * Returns an `AddLayerObject` for café map labels.
 *
 * @returns {ML.AddLayerObject}
 */
function cafeLabelLayer() {
  const layer = {
    id: CAFES.labelLayerId,
    type: "symbol",
    source: CAFES.sourceName,
    layout: {
      "text-field": ["get", "name"],

      "text-overlap": "never",
      "text-anchor": "top",
      "text-size": 12,
      "text-offset": [0, 0.8],
    },
  };

  return layer;
}
