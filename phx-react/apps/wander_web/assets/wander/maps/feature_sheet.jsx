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
import { memo, useEffect, useRef } from "react";

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

export function FeatureSheet({ feature, onClose }) {
  const elementRef = useRef(null);
  const [dY, isDragging, onMouseDown, onTouchStart] = useVerticalDrag();

  /*
  // Testing querying for element heights:
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    if (elementRef.current === null) {
      return;
    }

    const headerRect = elementRef.current.getBoundingClientRect();
    console.log("headerRect", headerRect);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        console.log("[resizeObserver]", entry.contentRect.height);
      }
    });
    resizeObserver.observe(elementRef.current);
    resizeObserverRef.current = resizeObserver;

    return () => {
      resizeObserverRef.disconnect();
      resizeObserverRef.current = null;
    };
  }, []);
  */

  const titleShrinkProgress = calcTitleShrinkProgress(dY);

  return (
    <div className="overflow-hidden absolute inset-0 touch-pan-y">
      <div
        className={clsx([
          "absolute bottom-0 z-[20]",
          "w-full",
          "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
          "pt-px", // For `ResizeHandle`

          "border-t rounded-[14px]",
          "shadow-[0_0_4.5px_4px_rgb(0_0_0_/_.1)]",

          "text-black bg-[#fafafa] border-[#f4f4f4]",

          isDragging && "select-none",
        ])}
        ref={elementRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
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
            />
          </div>

          <MemoNavBar
            horizontalGutterClasses={horizontalGutterClasses}
            className="mt-[10px]"
          />

          <MemoInfo feature={feature} />
        </div>
      </div>

      {/*
      <div
        className={clsx([
          "absolute top-full mt-[-1px] z-[21]",
          "w-full",
          "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
          "border-b rounded-b-[14px]",
          "text-black bg-[#fafafa] border-[#f4f4f4]",
          isDragging && "select-none",
        ])}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{
          transform: `translateY(${dY}px)`,
        }}
      >
        <Info feature={feature} />
      </div>
      */}
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
