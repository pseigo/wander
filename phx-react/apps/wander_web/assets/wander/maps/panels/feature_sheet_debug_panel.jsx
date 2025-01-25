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
import { useCallback, useEffect, useState } from "react";

import { getSafeAreaInset } from "/wander/common/documents";

export function FeatureSheetDebugPanel({ dY, headerHeight }) {
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const onResize = () => {
      const insets = {
        top: getSafeAreaInset("top"),
        right: getSafeAreaInset("right"),
        bottom: getSafeAreaInset("bottom"),
        left: getSafeAreaInset("left"),
      };
      //console.log("insets updated", insets);
      setSafeAreaInsets(insets);
    };

    onResize();

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      id="sheet-detent-panel"
      className={clsx([
        "text-black bg-[rgb(255_255_255_/_0.6)]",
        "dark:text-white dark:bg-[rgb(0_0_0_/_0.6)]",
        "rounded-br-md",
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
        {safeAreaInsets.top}/{safeAreaInsets.right}/{safeAreaInsets.bottom}/
        {safeAreaInsets.left}
      </div>
    </div>
  );
}

export function useFeatureSheetDebugInfo() {
  const [dY, setDY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const getSetters = useCallback(() => {
    return { dY: setDY, headerHeight: setHeaderHeight };
  }, [setDY, setHeaderHeight]);

  return [getSetters, dY, headerHeight];
}
