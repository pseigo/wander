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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { isHtmlElement } from "/wander/common/elements";

import { FEATURE_SHEET_ELEMENT_ID } from "./constants";

/**
 * Provides automatic vertical scrolling when content overflows the sheet's
 * visible area, and performant scaling during high-frequency sheet resizes
 * (via gestures and animations).
 *
 * @param {object} props
 * @param {ReactNode} props.children
 * @param {boolean} isDragging
 * @param {SheetDetent} currentDetent
 * @param {number} sheetDY
 * @param {number} sheetHeight
 * @param {number} sheetHeaderHeight
 */
export const ScrollableContent = memo(function ScrollableContent({
  children,
  isDragging,
  currentDetent,
  sheetDY,
  sheetHeight,
  sheetHeaderHeight,
}) {
  const outerTransformContainerRef = useRef(null);
  const innerTransformContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [height, setHeight] = useState("100%");
  const [outerContainerTransform, setOuterContainerTransform] = useState("");
  const [innerContainerTransform, setInnerContainerTransform] = useState("");

  const [handleDragGesture, handleScroll] = useScrolling(scrollContainerRef);

  useResizing(
    height,
    setHeight,
    setOuterContainerTransform,
    setInnerContainerTransform,
    outerTransformContainerRef,
    scrollContainerRef,
    isDragging,
    sheetDY,
    sheetHeight,
    sheetHeaderHeight
  );

  return (
    <div
      data-testid="feature-sheet__scrollable-content__outer-transform-container"
      className="will-change-transform origin-top overflow-hidden"
      style={{
        height: height,
        transform: outerContainerTransform,
      }}
      ref={outerTransformContainerRef}
    >
      <div
        data-testid="feature-sheet__scrollable-content__inner-transform-container"
        className="origin-top"
        style={{
          height: height,
          transform: innerContainerTransform,
        }}
        ref={innerTransformContainerRef}
      >
        <div
          data-testid="feature-sheet__scrollable-content__scroll-container"
          className={clsx([
            "w-full h-full",
            currentDetent !== "small" && !isDragging
              ? "overflow-y-scroll"
              : "overflow-y-hidden",
            "mb-[calc(env(safe-area-inset-bottom))]",
          ])}
          onScroll={handleScroll}
          onPointerDown={handleDragGesture}
          onTouchStart={handleDragGesture}
          //onPointerMove={handleDragGesture}
          onTouchMove={handleDragGesture}
          ref={scrollContainerRef}
        >
          <div
            data-testid="feature-sheet__scrollable-content__content-container"
            className="mb-[14px] select-none"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * @param {React.RefObject<HTMLElement>} scrollContainerRef
 */
function useScrolling(scrollContainerRef) {
  const allowingSheetDraggingRef = useRef(true);

  const handleScroll = useCallback((_e) => {
    const scrollTop = scrollContainerRef.current.scrollTop;
    const scrollTopMax = scrollContainerRef.current.scrollTopMax;
    console.log(
      "[collections][event:scroll] scrollTop: ",
      scrollTop,
      scrollTopMax
    );

    if (scrollTop === 0) {
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

  return [handleDragGesture, handleScroll];
}

/**
 * @param {React.Dispatch<React.SetStateAction<int>>} setHeight
 * @param {boolean} isDragging
 * @param {int} sheetDY
 * @param {int} yOffsetFromSheetTop
 */
function useResizing(
  height,
  setHeight,
  setOuterContainerTransform,
  setInnerContainerTransform,
  outerTransformContainerRef,
  scrollContainerRef,
  isDragging,
  sheetDY,
  sheetHeight,
  sheetHeaderHeight
) {
  const offsetFromSheetTop = useMemo(() => {
    const outerTransformContainer = outerTransformContainerRef.current;
    return outerTransformContainer !== null
      ? getOffsetFromSheetTop(outerTransformContainer)
      : 0;
  }, [outerTransformContainerRef.current, sheetHeaderHeight]);

  const fullContentAreaHeight = useMemo(
    () => sheetHeight - offsetFromSheetTop,
    [sheetHeight, offsetFromSheetTop]
  );

  const visibleContentAreaHeight = useMemo(
    () => Math.min(-1 * sheetDY, sheetHeight) - offsetFromSheetTop,
    [sheetDY, offsetFromSheetTop]
  );

  const visibleContentAreaHeightRatio = useMemo(
    () =>
      fullContentAreaHeight !== 0
        ? visibleContentAreaHeight / fullContentAreaHeight
        : 0,
    [fullContentAreaHeight, visibleContentAreaHeight]
  );

  const inverseVisibleContentAreaHeightRatio = useMemo(
    () =>
      visibleContentAreaHeightRatio !== 0
        ? 1 / visibleContentAreaHeightRatio
        : 0,
    [visibleContentAreaHeightRatio]
  );

  const dragState = useRef(null);

  useEffect(() => {
    if (isDragging) {
      if (dragState.current === null) {
        const scrollHeight = scrollContainerRef.current.scrollHeight;
        const scrollTop = scrollContainerRef.current.scrollTop;

        dragState.current = {
          scrollHeight: scrollHeight,
          scrollTop: scrollTop,
          initialSheetDY: sheetDY,
          initialVisibleContentAreaHeight: visibleContentAreaHeight,
          shouldStickToBottom:
            scrollTop >= scrollHeight - visibleContentAreaHeight,
        };
      }

      const {
        scrollHeight,
        scrollTop,
        initialSheetDY,
        initialVisibleContentAreaHeight,
        shouldStickToBottom,
      } = dragState.current;

      const hiddenContentAreaHeight =
        fullContentAreaHeight - visibleContentAreaHeight;
      const initialScrollBottomGapHeight =
        scrollHeight - scrollTop - visibleContentAreaHeight;

      const nudgeHeight =
        hiddenContentAreaHeight - initialScrollBottomGapHeight;
      const maybeStickToBottom = shouldStickToBottom
        ? sheetDY - initialSheetDY
        : 0;

      const isOverflowing = scrollHeight > fullContentAreaHeight;
      const fullHeightWillDisruptScrollPosition =
        scrollTop >= scrollHeight - fullContentAreaHeight;

      const verticalDisplacement =
        isOverflowing && fullHeightWillDisruptScrollPosition
          ? -1 * (nudgeHeight + maybeStickToBottom)
          : 0;

      setHeight("100%");
      setOuterContainerTransform(`scaleY(${visibleContentAreaHeightRatio})`);
      setInnerContainerTransform(
        `scaleY(${inverseVisibleContentAreaHeightRatio}) translateY(${verticalDisplacement}px)`
      );
    } else {
      setInnerContainerTransform("");
      setOuterContainerTransform("");
      setHeight(`${Math.max(44, visibleContentAreaHeight)}px`);
    }
  }, [isDragging, sheetDY, offsetFromSheetTop]);

  // When drag completes: Restore scroll position and clean up `dragState`.
  useEffect(() => {
    if (!isDragging && height !== "100%" && dragState.current !== null) {
      const scrollTop = dragState.current.scrollTop;
      scrollContainerRef.current.scroll(0, scrollTop, { behavior: "instant" });
      dragState.current = null;
    }
  }, [isDragging, height]);
}

/**
 * Returns the `child` element's offset from the sheet's top edge.
 *
 * @param {HTMLElement} child
 *
 * @returns {number}
 *
 * @requires `child` is a descendent of the feature sheet
 * @throws {Error} if `child` is not a descendent of the feature sheet
 */
function getOffsetFromSheetTop(child) {
  if (!isHtmlElement(child)) {
    throw new TypeError("`child` arg must be an `HTMLElement`");
  }
  if (child.closest(`#${FEATURE_SHEET_ELEMENT_ID}`) === null) {
    throw new Error("failed to find sheet in `child` arg's ancestors");
  }

  return doGetOffsetFromSheetTop(child, 0);
}

/**
 * @param {HTMLElement} child
 * @param {number} acc - The accumulated offset so far.
 *
 * @returns {number} The total offset from the sheet top.
 *
 * @requires `child` is a descendent of the feature sheet
 * @throws {TypeError} if `child` is not a descendent of the feature sheet
 */
function doGetOffsetFromSheetTop(child, acc) {
  if (child.id === FEATURE_SHEET_ELEMENT_ID) {
    return acc;
  }
  return doGetOffsetFromSheetTop(child.parentElement, acc + child.offsetTop);
}
