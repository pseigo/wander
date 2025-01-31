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

import { MaterialIcon } from "/wander/common/components/icon";

export function IconWithContent({
  icon,
  content,
  flexAlignClasses = "items-center",
}) {
  return (
    <div
      className={clsx([
        //"h-[24px]", // whyyyyyyyyy is it 30px
        "mx-[10px] my-[10px]",
        "flex flex-row gap-[12px]",
        flexAlignClasses,
      ])}
    >
      {icon}
      {content}
    </div>
  );
}

/**
 * Renders a row icon. See `MaterialIcon` for info on `name`.
 *
 * @param {object} props
 * @param {string} props.name - The Material Symbols icon name in lower-snakecase.
 */
export function RowIcon({ name }) {
  return (
    <MaterialIcon
      name={name}
      className="text-[24px] w-[24px] h-[24px] opsz-24 grad-0 dark:grad-n25 font-normal text-[#888888]"
    />
  );
}
