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

const heroPrefix = "hero-";
const materialPrefix = "material_";

/**
 * @typedef {("micro" | "mini" | "compact" | "normal" | "big" | "huge"}) IconSize
 */

/**
 * A generic component that can either render a
 * [Heroicon](https://heroicons.com) or a
 * [Material Symbols](https://fonts.google.com/icons) icon,
 * depending on the prefix of `name`.
 *
 * - Heroicon:  The `name` property should start with `hero-`.
 * - Material Symbol:  The `name` property should start with `material_`.
 *
 * Depending on the icon, you can customize the size and colours with CSS. See
 * each icon component's documentation for details.
 *
 * See the documentation for `HeroIcon` and `MaterialIcon` respectively to
 * learn more about them. You can also use those components directly if you
 * don't need polymorphism; that is recommended if you are using `MaterialIcon`
 * and setting utility classes for its variable font axes, as using it directly
 * is more explicit and less confusing.
 *
 * @license MIT
 * @see https://github.com/tailwindlabs/heroicons/blob/master/LICENSE
 *
 * @param {object} props
 * @param {string} props.name
 * @param {(IconSize | null)} props.size - Defaults to `null`. If you don't set this
 *  property, be sure to set your size classes in `className`.
 * @param {(string | string[] | null | undefined)} props.className
 */
export function Icon({ name, size = null, className }) {
  // prettier-ignore
  if (name.startsWith(heroPrefix))
  {
    return <HeroIcon name={name} size={size} className={className} />;
  }
  else if (name.startsWith(materialPrefix))
  {
    const unprefixedName = name.slice(materialPrefix.length);
    return <MaterialIcon name={unprefixedName} size={size} className={className} />;
  }

  throw new Error(
    `[Icon] '${name}' is not a known icon (it should start with 'hero-' or 'material_')`
  );
}

/**
 * Renders a [Heroicon](https://heroicons.com).
 *
 * You can customize the size and colours of the icons by setting `width`,
 * `height`, and `background-color` CSS classes. You may also use the `size`
 * property to set width and height in a consistent way across the application
 * (see the `IconSize` type).
 *
 * Heroicons come in three styles – outline, solid, and mini.
 * By default, the outline style is used, but solid and mini may
 * be applied by using the `-solid` and `-mini` suffix.
 *
 * Icons are extracted from the top-level `deps/heroicons` directory and bundled within
 * the compiled global.css by the plugin in `assets/tailwind.config.js`.
 *
 * See the Phoenix Framework documentation and generated
 * `WanderWeb.CoreComponents` module for more information on HeroIcons.
 *
 * @param {object} props
 * @param {string} props.name - The icon name prefixed with `hero-`.
 * @param {(IconSize | null)} props.size - Defaults to `null`. If you don't set this
 *  property, be sure to set your size classes in `className`.
 * @param {(string | string[] | null | undefined)} props.className
 */
export function HeroIcon({ name, size = null, className }) {
  return (
    <span className={clsx([name, classesForSize(size), className])}></span>
  );
}

/**
 * Renders a [Material Symbols](https://fonts.google.com/icons) icon.
 *
 * You can customize the size and colours by setting `font-size` and `color`
 * CSS classes. Google also recommends shifting these icons down by ~11.5% of
 * `font-size` for a more appealing vertical alignment with text on the same
 * line (how you accomplish that is up to you).
 *
 * These icons are rendered from a variable font. See
 * `assets/wander/common/styles/material_symbols.css` and the following
 * resources to learn more:
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings#registered_and_custom_axes
 *
 * ## Utility classes for variable font axes
 *
 * - Optical size ("opsz"): 20dp, 24dp, 40dp
 *   - `opsz-20`, `opsz-24`, `opsz-40`
 *
 * - Weight ("wght"): 300, 400, 500, 600
 *   - `font-light`, `font-normal`, `font-medium`, `font-semibold`
 *
 * - Fill ("FILL"): 0, 1
 *   - `fill`, (omit for no fill)
 *
 * - Grade ("GRAD"): -25, 0, 200
 *   - `grad-n25`, `grad-0`, `grad-200`
 *
 * @license Apache-2.0
 * @see https://github.com/google/material-design-icons/blob/master/LICENSE
 *
 * @param {object} props
 * @param {string} props.name - The icon name prefixed with `hero-`.
 * @param {(IconSize | null)} props.size - Defaults to `null`. If you don't set this
 *  property, be sure to set your size classes in `className`.
 * @param {(string | string[] | null | undefined)} props.className
 */
export function MaterialIcon({ name, size = null, className }) {
  return (
    <span
      className={clsx([
        "material-symbols-outlined",
        classesForSize(size),
        className,
      ])}
    >
      {name}
    </span>
  );
}

/**
 * @param {(IconSize | null)} size
 *
 * @returns {(string | string[] | null)}
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

    case null:
      return null;
  }

  throw new Error(`[Icon] '${size}' is not a valid \`IconButtonSize\``);
}
