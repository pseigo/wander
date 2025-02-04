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
import { memo, useEffect, useRef } from "react";

import { useElementHeightObserver } from "/wander/common/hooks/element_height_observer";
import { useViewportHeight } from "/wander/common/hooks/viewport_height";

import { useSheetDetents } from "./feature_sheet/sheet_detents";
import { useVerticalDrag } from "./feature_sheet/vertical_drag";
import { Header } from "./feature_sheet/header";
import { NavBar } from "./feature_sheet/nav_bar";
import { Info } from "./feature_sheet/info";
import { ResizeHandle } from "./feature_sheet/resize_handle";

const MemoHeader = memo(Header);
const MemoNavBar = memo(NavBar);
const MemoInfo = memo(Info);

const horizontalGutterClasses = "px-[14px]";
const verticalGutterClasses = "py-[14px]";

export function FeatureSheet({ feature, onClose, getDebugInfoSetters }) {
  const [viewportHeight] = useViewportHeight();
  const headerRef = useRef(null);
  const [headerHeight] = useElementHeightObserver(headerRef);

  const [
    dY,
    setDY,
    isDragging,
    completedDrag,
    setCompletedDrag,
    startMouseDrag,
    startTouchDrag,
  ] = useVerticalDrag(0);

  const [currentDetent] = useSheetDetents(
    setDY,
    completedDrag,
    setCompletedDrag,
    viewportHeight,
    headerHeight
  );

  //useDebugInfoReporting(getDebugInfoSetters, dY, headerHeight);

  const titleShrinkProgress = calcTitleShrinkProgress(dY);

  return (
    <div
      className={clsx([
        "feature-sheet",
        "overflow-hidden absolute",
        "inset-0",
        "mb-[calc(-1*env(safe-area-inset-bottom))]",
        "touch-pan-y",
      ])}
    >
      <div
        className={clsx([
          "absolute top-full z-[20]",
          "w-full min-h-full",
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

        <div className={verticalGutterClasses}>
          <div className={horizontalGutterClasses}>
            <MemoHeader
              feature={feature}
              onClose={onClose}
              titleShrinkProgress={titleShrinkProgress}
              currentDetent={currentDetent}
              ref={headerRef}
            />
          </div>

          <MemoNavBar
            horizontalGutterClasses={horizontalGutterClasses}
            className="mt-[10px]"
          />

          <MemoInfo feature={feature} />
        </div>
      </div>
    </div>
  );
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

/**
 * A temporary component for testing scrolling within the sheet.
 */
function SampleInnerScrollContainer() {
  return (
    <div
      className={clsx([
        "m-touch/4",
        "p-touch/4 h-[150px]",
        //"pb-[calc(theme(spacing[touch/2])_+_env(safe-area-inset-bottom))]",
        "overflow-y-scroll",
        "border-2 border-gray-300 rounded-md",
      ])}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <span>Things we would like to contain to a scrolling container:</span>
      <ul className="list-disc list-inside">
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
        <li>foobar</li>
      </ul>
    </div>
  );
}
