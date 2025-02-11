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

import * as Config from "/wander/common/config";
import { toMarkdownTable } from "/wander/common/strings/markdown_table";
import {
  externalRasterStyle,
  externalVectorStyle,
  createInternalVectorStyle,
} from "/wander/maps/maplibre/styles";

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

  const region = Config.get("map.tile.region");
  const tileType = Config.get("map.tile.type");
  const tileServiceType = Config.get("map.tile.service_type");

  const styleSpec = getStyleSpec(region, tileType, tileServiceType);

  const map = new ML.Map({
    container: nodeId,
    style: styleSpec,
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
 * @param {string} region - e.g., "alberta"
 * @param {("vector" | "raster")} tileType
 * @param {("internal" | "external")} tileType
 *
 * @returns {(MapLibreGlJs.StyleSpecification | undefined)}
 */
function getStyleSpec(region, tileType, tileServiceType) {
  const queryMappings = createStyleSpecQueryMappings(region);
  const styleSpec = doGetStyleSpec(
    { tileType, tileServiceType },
    queryMappings
  );

  if (styleSpec === undefined) {
    const validParamCombsTable = toMarkdownTable(
      [
        ["`tileServiceType`", "`tileType`"],
        ...queryMappings.map(({ tileServiceType, tileType }) => [
          `"${tileServiceType}"`,
          `"${tileType}"`,
        ]),
      ],
      { padding: 1 }
    );

    const description =
      `there is no style spec for the given parameter combination \`tileServiceType="${tileServiceType}", tileType="${tileType}"\`. styles are available for the following parameter combinations:\n\n` +
      validParamCombsTable;

    throw new Error(description);
  }

  return styleSpec;
}

/**
 * @param {{ region: string, tileType: string, tileServiceType: string }} query
 *
 * @returns {(MapLibreGlJs.StyleSpecification | undefined)}
 */
function doGetStyleSpec(query, queryMappings) {
  const queryMapping = queryMappings.find(
    ({ tileServiceType, tileType }) =>
      tileServiceType === query.tileServiceType && tileType === query.tileType
  );

  return queryMapping?.style();
}

/**
 * @param {string} region
 */
const createStyleSpecQueryMappings = (region) => [
  {
    tileServiceType: "internal",
    tileType: "vector",
    style: () => createInternalVectorStyle(region),
  },
  {
    tileServiceType: "external",
    tileType: "vector",
    style: () => externalVectorStyle,
  },
  {
    tileServiceType: "external",
    tileType: "raster",
    style: () => externalRasterStyle,
  },
];

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
