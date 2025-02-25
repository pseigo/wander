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
 * Returns the 'safe-area-inset' value for the given `side`.
 *
 * `./documents/safe_area_inset.css` must be included in the stylesheet for any
 * page where this function is called. It's a tiny file, so consider importing
 * it into the global stylesheet for your application.
 *
 * @see https://drafts.csswg.org/css-env/#safe-area-insets
 * @see https://webkit.org/blog/7929/designing-websites-for-iphone-x/
 * @see https://m3.material.io/foundations/layout/understanding-layout/hardware-considerations#8a709768-dc91-4fe5-beb9-be1e2206dd8b
 *
 * @param {("top" | "right" | "bottom" | "left")} side
 *
 * @returns {float}
 */
export function getSafeAreaInset(side) {
  if (!["top", "right", "bottom", "left"].includes(side)) {
    throw new Error(
      `[getSafeAreaInset/1] '${side}' is not a valid side (should be 'top', 'right', 'bottom', or 'left')`
    );
  }

  const propertyName = `--safe-area-inset-${side}`;
  const propertyValue = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(propertyName);

  if (propertyValue === "") {
    throw new Error(
      `[getSafeAreaInset/1] no value for property '${propertyName}' on document (has 'wander/common/documents/safe_area_inset.css' been imported into this page's stylesheet?)`
    );
  }

  const inset = parseFloat(propertyValue);
  return inset;
}
