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
import { memo, useEffect, useState, useRef } from "react";

import * as Config from "/wander/common/config";
import { useElementHeightObserver } from "/wander/common/hooks/element_height_observer";
import { useViewportHeight } from "/wander/common/hooks/viewport_height";

import { useSheetDetents } from "./feature_sheet/sheet_detents";
import { useVerticalDrag } from "./feature_sheet/vertical_drag";
import { ResizeHandle } from "./feature_sheet/resize_handle";
import { Header } from "./feature_sheet/header";
import { NavBar } from "./feature_sheet/nav_bar";
import { Info } from "./feature_sheet/info";
import { Collections } from "./feature_sheet/collections";
import { Notes } from "./feature_sheet/notes";

const horizontalGutterClasses = "px-[14px]";

export function FeatureSheet({ feature, onClose, getDebugInfoSetters }) {

  const [viewportHeight] = useViewportHeight();
  const headerRef = useRef(null);
  const [headerHeight] = useElementHeightObserver(headerRef);

  const [currentTab, setCurrentTab] = useState(initialTab());

  const [
    dY,
    setDY,
    isDragging,
    completedDrag,
    setCompletedDrag,
    startMouseDrag,
    startTouchDrag,
  ] = useVerticalDrag({ initialDY: 0 });

  const [currentDetent] = useSheetDetents(
    setDY,
    completedDrag,
    setCompletedDrag,
    viewportHeight,
    headerHeight
  );

  useDebugInfoReporting(getDebugInfoSetters, dY, headerHeight);

  const titleShrinkProgress = calcTitleShrinkProgress(dY);

  return (
    <div
      data-testid="feature-sheet__fullscreen-container"
      className={clsx([
        "absolute inset-0 overflow-hidden",
        "mb-[calc(-1*env(safe-area-inset-bottom))]",
        "touch-pan-y",
      ])}
    >
      <div
        data-testid="feature-sheet"
        className={clsx([
          "absolute top-full z-[20]",
          "w-full h-[95vh] box-border overflow-y-hidden",
          "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
          "pt-px", // For `ResizeHandle`

          "border-t rounded-[14px]",
          "shadow-[0_0_4.5px_4px_rgb(0_0_0_/_.1)]",

          "text-black bg-[#fafafa] border-[#f4f4f4]",

          isDragging && "select-none",
        ])}
        onMouseDown={startMouseDrag}
        onTouchStart={startTouchDrag}
        style={{
          transform: `translateY(${dY}px)`,
        }}
      >
        <ResizeHandle />

        <div
          data-testid="feature-sheet__content-container"
          className={clsx(["h-full", "pt-[14px]", "flex flex-col gap-0"])}
        >
          <div
            data-testid="feature-sheet__header-container"
            className={horizontalGutterClasses}
          >
            <Header
              feature={feature}
              onClose={onClose}
              titleShrinkProgress={titleShrinkProgress}
              currentDetent={currentDetent}
              ref={headerRef}
            />
          </div>

          <NavBar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            horizontalGutterClasses={horizontalGutterClasses}
            className="mt-[10px]"
          />
          {detailForTab(currentTab, feature, currentDetent)}
        </div>
      </div>
    </div>
  );
}

/**
 * @returns {("info" | "collections" | "notes")}
 */
function initialTab() {
  const defaultTab = "info";

  if (Config.get("enabled", "debug")) {
    return Config.get("map.feature_sheet.initial.tab", "debug") || defaultTab;
  }

  return defaultTab;
}

/**
 * @param {("info" | "collections" | "notes")} tab
 * @param {Feature} feature
 * @param {SheetDetent} currentDetent
 *
 * @returns {ReactNode}
 */
function detailForTab(tab, feature, currentDetent) {
  switch (tab) {
    case "info":
      return <Info feature={feature} currentDetent={currentDetent} />;

    case "collections":
      return <Collections feature={feature} currentDetent={currentDetent} />;

    case "notes":
      return <Notes feature={feature} />;
  }

  throw new Error(`unknown tab '${tab}'`);
}

/**
 * @param {number} dY
 *
 * @returns {float} in `[0, 1.0]`
 */
function calcTitleShrinkProgress(dY) {
  // clamp dY to [-40, 0]
  const clampedDY = Math.min(0, Math.max(-40, dY));

  // -40/x = 1
  // -20/x = 0.5
  // 0/x = 0
  const progress = clampedDY / -40;

  return progress;
}

/**
 * Reports debug info for anyone listening via the setters provided by
 * `getDebugInfoSetters`. May have a severe drain on performance.
 *
 * @param {function(any)} getDebugInfoSettings
 */
function useDebugInfoReporting(getDebugInfoSetters, dY, headerHeight) {
  useEffect(() => {
    getDebugInfoSetters().dY(dY);
  }, [dY]);

  useEffect(() => {
    getDebugInfoSetters().headerHeight(headerHeight);
  }, [headerHeight]);
}

function VerticalDragDebugInfo({ isDragging, dY }) {
  return (
    <p className="text-xs mt-2 text-gray-500">
      [DEBUG]: {isDragging ? "Dragging!" : "Not dragging."}
      <br />
      {dY < 0 ? "Medium or large detent." : "Small detent or collapsed."} |dY|=
      {Math.abs(dY)}{" "}
    </p>
  );
}
