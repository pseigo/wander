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

import { cafes } from "/wander/maps/data/places";

import { CAFES } from "./constants";

/**
 * @param {ML.Map} map
 */
export function addSources(map) {
  const source = cafeSource();
  map.addSource(CAFES.sourceName, source);
}

/**
 * Returns a GeoJSON source specification for cafés.
 *
 * @see https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#addsource
 * @see https://maplibre.org/maplibre-style-spec/sources/#geojson
 * @see https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-click/
 *
 * @returns {ML.SourceSpecification}
 */
function cafeSource() {
  /*
  const pointFeatures = cafes.filter((e) => {
    if (!Object.hasOwn(e, "type")) {
      return false;
    }
    const elementType = e["type"];

    if (elementType !== "Feature") {
      return false;
    }

    if (!Object.hasOwn(e, "geometry")) {
      return false;
    }
    const geometry = e["geometry"];

    if (!Object.hasOwn(geometry, "type")) {
      return false;
    }
    const geometryType = geometry["type"];

    return geometryType === "Point" && Object.hasOwn(geometry, "coordinates");
  });
  */

  const sourceSpec = {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
      //features: pointFeatures,
    },
  };

  return sourceSpec;
}

/**
 * @returns {Feature}
 */
export function sampleCafe() {
  const pointFeatures = cafes.filter((e) => {
    if (!Object.hasOwn(e, "type")) {
      return false;
    }
    const elementType = e["type"];

    if (elementType !== "Feature") {
      return false;
    }

    if (!Object.hasOwn(e, "geometry")) {
      return false;
    }
    const geometry = e["geometry"];

    if (!Object.hasOwn(geometry, "type")) {
      return false;
    }
    const geometryType = geometry["type"];

    return geometryType === "Point" && Object.hasOwn(geometry, "coordinates");
  });

  const rawFeature = pointFeatures.find((feature) => {
    return feature.properties.name === "Monogram Coffee";
  });

  if (rawFeature === undefined) {
    throw new Error("could not find a feature matching the search criteria");
  }

  const feature = {
    id: rawFeature.properties["@id"],
    properties: rawFeature.properties,
    geometry: rawFeature.geometry,
  };

  return feature;
}
