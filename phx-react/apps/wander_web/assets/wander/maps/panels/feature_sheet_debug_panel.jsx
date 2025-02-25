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

import * as Config from "/wander/common/config";
import { useSafeAreaInsets } from "/wander/common/hooks/safe_area_insets";

export function FeatureSheetDebugPanel({ dY, headerHeight }) {
  const [
    safeAreaInsetTop,
    safeAreaInsetRight,
    safeAreaInsetBottom,
    safeAreaInsetLeft,
  ] = useSafeAreaInsets();

  return (
    <div
      id="sheet-detent-panel"
      className={clsx([
        "text-black bg-[rgb(255_255_255_/_0.6)]",
        "dark:text-white dark:bg-[rgb(0_0_0_/_0.6)]",
        "pl-[env(safe-area-inset-left)]",
      ])}
    >
      <div
        className={clsx([
          //"pl-[calc(theme(spacing[touch/4])+env(safe-area-inset-left))]",
          "px-touch/4 pb-[1px]",
          "text-xs",
        ])}
      >
        dY: {dY}; Height: {headerHeight.toFixed(1)}; Safe insets (T/R/B/L):{" "}
        {safeAreaInsetTop}/{safeAreaInsetRight}/{safeAreaInsetBottom}/
        {safeAreaInsetLeft}
      </div>
    </div>
  );
}

export function useFeatureSheetDebugInfo() {
  const [dY, setDY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const getSetters = useCallback(() => {
    if (
      Config.get("enabled", "debug") &&
      Config.get("map.panels.feature_sheet", "debug")
    ) {
      return {
        dY: setDY,
        headerHeight: setHeaderHeight,
      };
    }

    const noOp = () => {};
    return {
      dY: noOp,
      headerHeight: noOp,
    };
  }, [setDY, setHeaderHeight]);

  return [getSetters, dY, headerHeight];
}
