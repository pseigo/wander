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

/**
 * Adds images to the `map` for layers to use.
 *
 * @param {ML.Map} map
 */
export async function addImages(map) {
  /** @type {ML.GetResourceResponse} */
  const response = await map.loadImage(
    "/images/icons/maps/marker-small@4x.png"
  );
  const markerSmall4x = response.data;
  map.addImage("marker-small-4x", markerSmall4x);
}
