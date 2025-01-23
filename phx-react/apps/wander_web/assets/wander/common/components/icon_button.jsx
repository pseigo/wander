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

import { Icon } from "/wander/common/components/icon";

/**
 * @typedef {("mini" | "compact" | "normal" | "big" | "huge"}) IconButtonSize
 */

/**
 * @param {object} props
 * @param {string} props.iconName - See `Icon` for details.
 * @param {IconButtonSize} props.size - Defaults to "normal".
 * @param {boolean} props.border - Defaults to `true`.
 * @param {function} props.onClick
 */
export function IconButton({
  iconName,
  size = "normal",
  border = true,
  onClick,
}) {
  return (
    <button
      className={clsx([
        classesForSize(size),

        border && [
          "border rounded-[16px]",
          "border-[#dad9d9]",
          "bg-white active:bg-[#f2f2f2] active:shadow-inner",
          "transition-colors duration-100",
        ],

        "flex flex-col justify-center",
      ])}
      onClick={onClick}
    >
      <div className="block mx-auto">
        <Icon name={iconName} size={size} />
      </div>
    </button>
  );
}

/**
 * @param {IconButtonSize} size
 *
 * @returns {(string | string[])}
 */
function classesForSize(size) {
  switch (size) {
    case "mini":
      return "h-[38px] w-[38px]";

    case "compact":
      return "h-[40px] w-[40px]";

    case "normal":
      return "h-touch w-touch";

    case "big":
      return "h-touch*5/4 w-touch*5/4";

    case "huge":
      return "h-touch*3/2 w-touch*3/2";
  }

  throw new Error(`[IconButton] '${size}' is not a valid \`IconButtonSize\``);
}
