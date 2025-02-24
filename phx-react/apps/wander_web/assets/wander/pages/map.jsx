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

import {
  useDocumentTitle,
  toDocumentTitle,
} from "/wander/common/hooks/document_title";
import { MapLibreMap } from "/wander/maps/maplibre_map";

import { useOsmCafes } from "./map/osm_pois";

export function MapPage(_props) {
  useDocumentTitle(toDocumentTitle("Map"));
  const [cafes] = useOsmCafes();

  return (
    <div className={clsx(["w-full h-full", "dark:text-black"])}>
      <MapLibreMap cafes={cafes} />

      <style>{`
        html, body, #app {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: clip;
        }
      `}</style>
    </div>
  );
}
