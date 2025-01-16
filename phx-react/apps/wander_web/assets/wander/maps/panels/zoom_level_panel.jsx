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

export function ZoomLevelPanel({ zoomLevel }) {
  return (
    <div
      id="zoom-level-panel"
      className={clsx([
        "text-black bg-[rgb(255_255_255_/_0.6)]",
        "dark:text-white dark:bg-[rgb(0_0_0_/_0.6)]",
        //"rounded-tr-md",
      ])}
    >
      <div
        className={clsx([
          //"pl-[calc(theme(spacing[touch/4])+env(safe-area-inset-left))]",
          "px-touch/4 pb-[1px]",
          "text-xs",
        ])}
      >
        Zoom level: {zoomLevel.toFixed(2)}
      </div>
    </div>
  );
}