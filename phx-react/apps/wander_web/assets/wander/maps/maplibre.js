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

import * as Lifecycle from "./maplibre/lifecycle";
import * as Sources from "./maplibre/sources";
import * as Images from "./maplibre/images";
import * as Layers from "./maplibre/layers";

/**
 * @param {string} nodeId - Value of the `id` attribute on the HTML container
 *  to initialize the map into.
 * @param {{longitude: string, latitude: string} initialCenter
 * @param {number} initialZoomLevel
 *
 * @returns {ML.Map} Reference to the MapLibre Map object. You must call
 *  `deleteMap` on this when you are done with the map to reclaim its
 *  resources.
 */
export function createMap(nodeId, initialCenter, initialZoomLevel) {
  return Lifecycle.createMap(nodeId, initialCenter, initialZoomLevel);
}

/**
 * Frees resources for `map`.
 *
 * You must NOT use or call any methods on `map` after invoking this
 * function; you should clear any references to `map` so the JavaScript
 * runtime can garbage collect it.
 *
 * @param {ML.Map} `map` - The MapLibre Map to delete.
 */
export function deleteMap(map) {
  Lifecycle.deleteMap(map);
}

/**
 * Adds preconfigured sources for `map`.
 *
 * @param {ML.Map} `map` - The MapLibre Map to add the sources to.
 */
export function addSources(map) {
  Sources.addSources(map);
}

/**
 * Adds preconfigured images for `map`.
 *
 * @param {ML.Map} `map` - The MapLibre Map to add the images to.
 */
export function addImages(map) {
  Images.addImages(map);
}

/**
 * Adds preconfigured layers for `map`.
 *
 * @param {ML.Map} `map` - The MapLibre Map to add the layers to.
 */
export function addLayers(map) {
  Layers.addLayers(map);
}
