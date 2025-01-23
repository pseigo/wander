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
import { memo } from "react";

import { MaterialIcon } from "/wander/common/components/icon";

/**
 * Renders an amenity icon. See `MaterialIcon` for appearance utility classes.
 */
export const AmenityIcon = memo(function AmenityIcon({ name, className }) {
  return (
    <MaterialIcon
      name={name}
      className={clsx([
        "text-[#46afcc]",
        "text-[1.125rem]",
        // Shift symbols down by ~11.5%-12% of font size.
        "relative top-[.135rem]",
        "opsz-20 grad-0 dark:grad-n25",
        className,
      ])}
    />
  );
});
