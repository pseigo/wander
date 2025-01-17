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

import { Info } from "./feature_sheet/info";

export function FeatureSheet({ feature, onClose }) {
  if (feature === null) {
    return null;
  }

  return (
    <div
      className={clsx([
        "absolute bottom-0 z-[20]",
        "w-full",
        "border rounded-t-[14px]",
        "shadow-[0_0_4.5px_4px_rgb(0_0_0_/_.1)]",
        "text-black bg-[#fafafa] border-[#f4f4f4]",
        "p-touch/4",
      ])}
      hidden={feature === null}
    >
      <Info feature={feature} onClose={onClose} />
    </div>
  );
}
