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
import { TopTabBar } from "/wander/common/components/top_tab_bar";

export function NavBar({ horizontalGutterClasses, className }) {
  return (
    <div
      className={clsx([
        "w-full",
        "border-b border-[#e1e1e1]",
        horizontalGutterClasses,
        className,
      ])}
    >
      <TopTabBar>
        <TopTabBar.Button
          isActive={true}
          label={"Info"}
          icon={
            <MaterialIcon
              name="info"
              className={topTabBarButtonIconClasses(true)}
            />
          }
        />
        <TopTabBar.Button
          isActive={false}
          label={"Check-Ins"}
          icon={
            <MaterialIcon
              name="beenhere"
              className={topTabBarButtonIconClasses(false)}
            />
          }
        />
        <TopTabBar.Button
          isActive={false}
          label={"Collections"}
          icon={
            <MaterialIcon
              name="collections_bookmark"
              className={topTabBarButtonIconClasses(false)}
            />
          }
        />
      </TopTabBar>
    </div>
  );
}

function topTabBarButtonIconClasses(isActive) {
  return clsx([
    "w-[19px] h-[19px]",
    "opsz-20 grad-0 dark:grad-n25",
    isActive ? "font-semibold fill" : "font-normal",
  ]);
}
