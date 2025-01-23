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

export function TopTabBar({ children, className }) {
  return <div className={clsx(["flex flex-row", className])}>{children}</div>;
}

/**
 * @param {object} props
 * @param {boolean} props.isActive
 * @param {string} props.label
 * @param {ReactElement} props.icon
 */
TopTabBar.Button = function Button({ isActive = false, label, icon }) {
  return (
    <button
      aria-label={label}
      className={clsx([
        // For containing flexbox.
        "grow shrink basis-0",

        // Icon and label.
        "flex flex-col items-center gap-px",
        isActive ? "text-[#0c9cb9]" : "text-[#686868]",

        // For active indicator.
        "relative",
        "pb-[2px]",
      ])}
    >
      {icon}
      <span className="text-[.813rem] mt-[-6px]">{label}</span>
      {!!isActive && <ActiveTabIndicator />}
    </button>
  );
};

const ActiveTabIndicator = memo(function ActiveTabIndicator({ width }) {
  return (
    <div
      aria-hidden="true"
      className={clsx([
        "absolute bottom-0",
        "w-[98%] h-[4px]",
        "overflow-hidden",
      ])}
    >
      <div
        className={clsx([
          "absolute top-[1px]",
          "w-full h-[1px] border-[6px] rounded-[8px]",
          "bg-[#53b7cb] border-[#53b7cb]",
        ])}
      ></div>
    </div>
  );
});
