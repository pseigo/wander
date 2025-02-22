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

/**
 * A temporary component for testing scrolling within the sheet.
 */
export function SampleInnerScrollContainer() {
  return (
    <div
      data-testid="feature-sheet__collections__sample-inner-scroll-container"
      className={clsx([
        "m-touch/4",
        "p-touch/4 h-[150px]",
        //"pb-[calc(theme(spacing[touch/2])_+_env(safe-area-inset-bottom))]",
        "overflow-y-scroll",
        "border-2 border-gray-300 rounded-md",
      ])}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <span>Things we would like to contain to a scrolling container:</span>
      <ul className="list-disc list-inside">
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
      </ul>
    </div>
  );
}
