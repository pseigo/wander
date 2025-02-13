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
import { memo, useCallback, useRef, useState } from "react";

import { Index } from "./collections/index";
import { sampleCollections } from "./collections/sample_collections";

/**
 * @typedef {{
 *   id: string,
 *   owner_id: string,
 *   name: string
 * }} FeatureCollection
 */

export function Collections({ _feature, currentDetent }) {
  const elementRef = useRef(null);
  const allowingSheetDraggingRef = useRef(true);

  const handleScroll = useCallback((_e) => {
    const dY = elementRef.current.scrollTop;
    //console.log("[collections][event:scroll] dY: ", dY);

    if (dY === 0) {
      allowingSheetDraggingRef.current = true;
      //} else if (allowingSheetDragging.current) {
    } else {
      allowingSheetDraggingRef.current = false;
    }
  }, []);

  const handleDragGesture = useCallback((e) => {
    //console.log("[collections][drag_gesture]");
    e.stopPropagation();

    /*
    if (currentDetent !== "large") {
      //console.log("[collections][drag_gesture] preventing content scrolling");
      e.preventDefault();
      return;
    }
    */
    /*
    if (!allowingSheetDraggingRef.current) {
      //console.log("[collections][drag_gesture] preventing sheet dragging");
      e.stopPropagation();
    }
    */
  }, []);

  return (
    <div
      data-testid="feature-sheet__collections"
      className={clsx([
        "w-full h-full",
        currentDetent !== "small" ? "overflow-y-scroll" : "overflow-y-hidden",
      ])}
      onScroll={handleScroll}
      onPointerDown={handleDragGesture}
      onTouchStart={handleDragGesture}
      //onPointerMove={handleDragGesture}
      onTouchMove={handleDragGesture}
      ref={elementRef}
    >
      <div className="mb-[14px] select-none">
        <Index collections={sampleCollections} />
      </div>
    </div>
  );
}
