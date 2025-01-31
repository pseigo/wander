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
import { useCallback, useState } from "react";

import { MaterialIcon } from "/wander/common/components/icon";

/**
 * @param {object} props
 * @param {ReactElement} props.children
 * @param {boolean} isInitiallyExpanded - Defaults to `false`.
 */
export function Disclosure({ children, isInitiallyExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);

  const onToggleExpanded = useCallback(
    () => setIsExpanded((isExpanded) => !isExpanded),
    [isExpanded]
  );

  return (
    <div className={clsx(["flex flex-row gap-0 justify-between"])}>
      {typeof children === "function" ? children(isExpanded) : children}
      <DisclosureToggleButton
        isExpanded={isExpanded}
        onToggleExpanded={onToggleExpanded}
      />
    </div>
  );
}

/**
 * @param {object} props
 * @param {boolean} props.isExpanded
 * @param {function} props.onToggleExpanded
 */
function DisclosureToggleButton({ isExpanded, onToggleExpanded }) {
  return (
    <button
      className={clsx([
        "h-touch w-touch",
        "flex flex-row items-center justify-center",
        "group",
      ])}
      onClick={onToggleExpanded}
    >
      <MaterialIcon
        name="chevron_right"
        className={clsx([
          "text-[24px] w-[24px] h-[24px] opsz-24 grad-0 dark:grad-n25 font-normal",
          "text-[#888888] group-active:text-[rgb(91,91,91)]",
          "transition-[transform] duration-300 ease-[cubic-bezier(.16,1,.56,1)]",
        ])}
        style={{
          transform: isExpanded ? "rotate(270deg)" : "rotate(90deg)",
        }}
      />
    </button>
  );
}
