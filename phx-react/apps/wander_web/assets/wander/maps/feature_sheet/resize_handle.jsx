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
import { memo } from "react";

// TODO: how to make this be shown when the sheet shows, rather than popping in late?
export const ResizeHandle = memo(function ResizeHandle() {
  return (
    <img
      src="/images/decorations/sheet-resize-handle-light.svg"
      aria-hidden="true"
      className={clsx([
        "absolute",
        "top-[4px]",
        "left-1/2 translate-x-[-50%]",
        "pointer-events-none",
      ])}
    />
  );
});
