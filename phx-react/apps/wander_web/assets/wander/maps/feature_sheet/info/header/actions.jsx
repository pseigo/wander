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

import { IconButton } from "/wander/common/components/icon_button";

import { AmenityIcon } from "./amenity_icon";

export function Actions({ onClose }) {
  return (
    <div className={clsx(["flex flex-row gap-[9px]", "float-right"])}>
      <IconButton
        iconName="hero-bookmark"
        size="compact"
        border={true}
        onClick={() => console.log("[action button clicked] TODO")}
      />
      <IconButton
        iconName="hero-x-mark"
        size="compact"
        border={true}
        onClick={onClose}
      />
    </div>
  );
}
