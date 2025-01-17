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

/**
 * @typedef {("micro" | "mini" | "compact" | "normal" | "big" | "huge"}) IconSize
 */

/**
 * Renders a [Heroicon](https://heroicons.com).
 *
 * The `name` property should start with `hero-`.
 *
 * Heroicons come in three styles – outline, solid, and mini.
 * By default, the outline style is used, but solid and mini may
 * be applied by using the `-solid` and `-mini` suffix.
 *
 * You can customize the size and colors of the icons by setting
 * width, height, and background color classes.
 *
 * Icons are extracted from the top-level `deps/heroicons` directory and bundled within
 * the compiled global.css by the plugin in `assets/tailwind.config.js`.
 *
 * See the Phoenix Framework documentation and generated
 * `WanderWeb.CoreComponents` module for more information on HeroIcons.
 *
 * @param {object} props
 * @param {string} name
 * @param {IconSize} size - Defaults to "normal".
 * @param {(string | string[] | null | undefined)} className
 */
export function Icon({ name, size = "normal", className }) {
  return (
    <span className={clsx([name, classesForSize(size), className])}></span>
  );
}

/**
 * @param {IconSize} size
 *
 * @returns {(string | string[])}
 */
function classesForSize(size) {
  switch (size) {
    case "micro":
      return "h-[16px] w-[16px]";

    case "mini":
      return "h-[18px] w-[18px]";

    case "compact":
      return "h-[22px] w-[22px]";

    case "normal":
      return "h-[24px] w-[24px]";

    case "big":
      return "h-[30px] w-[30px]";

    case "huge":
      return "h-[36px] w-[36px]";
  }

  throw new Error(`[Icon] '${size}' is not a valid \`IconButtonSize\``);
}
