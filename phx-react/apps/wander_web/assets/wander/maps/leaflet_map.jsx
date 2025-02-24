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
import { useEffect, useRef } from "react";
import * as L from "/vendor/leaflet/leaflet-src.esm.js";

import { randomLowerAlphaNumericString } from "/wander/common/strings";

export function LeafletMap() {
  const mapNodeId = useRef(`LeafletMap-${randomLowerAlphaNumericString()}`);
  const mapRef = useRef(null);

  useEffect(() => {
    initMap();
    mapRef.current.setView([51.505, -0.09], 13);
  }, []);

  function initMap() {
    if (mapRef.current !== null) {
      return;
    }

    mapRef.current = L.map(mapNodeId.current);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);
  }

  return (
    // prettier-ignore
    <div id={mapNodeId.current} className={clsx([
      "w-full h-full",
      "bg-gray-300"
    ])}></div>
  );
}
