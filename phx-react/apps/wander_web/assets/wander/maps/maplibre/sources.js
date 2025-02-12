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

import * as Config from "/wander/common/config";
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
    // INVARIANT: The property `promoteId` references MUST be an integer (not a
    //  string). See: https://github.com/maplibre/maplibre-gl-js/discussions/3134#discussioncomment-7133626
    promoteId: "@id",
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

  const findByName = Config.get(
    "map.override_selected_feature_with.find_by.name",
    "debug"
  );

  const rawFeature = pointFeatures.find((feature) => {
    return feature.properties.name === findByName;
  });

  if (rawFeature === undefined) {
    if (
      Config.get("enabled", "debug") &&
      Config.get("override_selected_feature", "debug")
    ) {
      throw new Error(
        `could not find a feature matching the search criteria (name="${findByName}")`
      );
    } else {
      return {
        properties: { "@id": 0, "@type": "none" },
        geometry: { coordinates: [0, 0] },
      };
    }
  }

  const [osmType, osmId] = rawFeature.id.split("/");

  // The server puts the "@type" and "@id" properties as a string (like "node")
  // and an integer, and that's how the React components expect it.
  const properties = {
    ...rawFeature.properties,
    "@type": osmType,
    "@id": osmId,
  };

  const feature = {
    id: rawFeature.id,
    properties: properties,
    geometry: rawFeature.geometry,
  };

  return feature;
}
