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
import { useLocation } from "wouter";

import { Button } from "/wander/common/components/button";
import {
  useDocumentTitle,
  toDocumentTitle,
} from "/wander/common/hooks/document_title";
import { LeafletMap } from "/wander/maps/leaflet_map";
import { MapLibreMap } from "/wander/maps/maplibre_map";

export function MapPage(_props) {
  const [_location, navigate] = useLocation();
  const [_documentTitle, _setDocumentTitle] = useDocumentTitle(
    toDocumentTitle("Map")
  );

  return (
    <div className={clsx(["w-full h-full", "dark:text-black"])}>
      {/*
      <Button label="Go Home" onClick={() => navigate("/")} />
      <LeafletMap />
      */}

      <MapLibreMap />

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
