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
import { clamp } from "/wander/common/numbers";
import { useSafeAreaInsetBottom } from "/wander/common/hooks/safe_area_insets";
import { useViewportHeight } from "/wander/common/hooks/viewport_height";

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
            className="mb-[calc(14px+env(safe-area-inset-bottom))] select-none"
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
function useScrolling(_scrollContainerRef) {
  const handleDragGesture = useCallback((e) => e.stopPropagation(), []);
  const handleScroll = useCallback((_e) => {}, []); // no-op

  return [handleDragGesture, handleScroll];

  /*
  const allowingSheetDraggingRef = useRef(true);

  const handleScroll = useCallback((_e) => {
    const scrollTop = scrollContainerRef.current.scrollTop;

    if (scrollTop === 0) {
      allowingSheetDraggingRef.current = true;
    } else {
      allowingSheetDraggingRef.current = false;
    }
  }, []);

  const handleDragGesture = useCallback((e) => {
    if (currentDetent !== "large") {
      //console.log("[collections][drag_gesture] preventing content scrolling");
      e.preventDefault();
    }
    else if (!allowingSheetDraggingRef.current) {
      //console.log("[collections][drag_gesture] preventing sheet dragging");
      e.stopPropagation();
    }
  }, []);
  */
}

// TODO: Perfect the scroll translation algorithm.
//
//  As it currently stands, this seems to work well enough (essential
//  interactivity works), but does not behave as we would like (visually)
//  in all situations.
//
//  It's important to test scroll positions at (1) the top and bottom,
//  (2) _near_ the top and bottom, and (3) in the middle, pulling from
//  the smallest to the largest detent and vice versa, and on screens
//  with zero and non-zero value for `env(safe-area-inset-bottom)` (CSS),
//  for content that:
//
//  (a) does not overflow the `visibleContentAreaHeight`,
//  (b) overflows `visibleContentAreaHeight` but not
//   `fullContentAreaHeight`, and
//  (c) overflows `fullContentAreaHeight`,
//
//  ... because a solution for one case may not work for all cases.
//
//  Performance optimizations are nice when possible, but correctness and
//  readability must be prioritized first.

/**
 * @param {number} height
 * @param {React.Dispatch<React.SetStateAction<number>>} setHeight
 * @param {React.Dispatch<React.SetStateAction<number>>} setOuterContainerTransform
 * @param {React.Dispatch<React.SetStateAction<number>>} setInnerContainerTransform
 * @param {React.RefObject<HTMLElement>} outerTransformContainerRef
 * @param {React.RefObject<HTMLElement>} scrollContainerRef
 * @param {boolean} isDragging
 * @param {number} sheetDY
 * @param {number} sheetHeight
 * @param {number} sheetHeaderHeight
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
  const safeAreaInsetBottom = useSafeAreaInsetBottom();

  const offsetFromSheetTop = useMemo(() => {
    const outerTransformContainer = outerTransformContainerRef.current;
    return outerTransformContainer !== null
      ? getOffsetFromSheetTop(outerTransformContainer)
      : 0;
  }, [
    // No change-tracking for refs, but still important to refresh this memo'd
    // value when this element ref is populated after the component's first
    // render (is there a better idiom to solve this problem?).
    outerTransformContainerRef.current,

    // The sheet header dynamically resizes across detents (concise opening
    // hours visbility, title size and wrapping, etc.).
    sheetHeaderHeight,
  ]);

  const fullContentAreaHeight = useMemo(
    () => sheetHeight - offsetFromSheetTop,
    [sheetHeight, offsetFromSheetTop]
  );

  const visibleContentAreaHeight = useMemo(
    () => Math.min(Math.max(0, -1 * sheetDY), sheetHeight) - offsetFromSheetTop,
    [sheetDY, sheetHeight, offsetFromSheetTop]
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
        const scrollContainer = scrollContainerRef.current;
        const scrollHeight = scrollContainer.scrollHeight;

        // Some platforms/browsers allow `scrollTop` to go out of bounds when
        // overscrolling (see the CSS property `overscroll-behavior`), into the
        // negatives or beyond `scrollHeight`, but others bound `scrollTop` to
        // `[0, scrollTopMax]`, so let's normalize it (for now).
        //const scrollTopMax = scrollContainer.scrollTopMax;
        //const scrollTop = clamp(scrollContainer.scrollTop, 0, scrollTopMax);
        const scrollTop = scrollContainer.scrollTop;

        const isOverflowing = scrollHeight > fullContentAreaHeight;

        const fullHeightWillDisruptShortScrollPosition =
          !isOverflowing &&
          scrollHeight > visibleContentAreaHeight &&
          scrollHeight < fullContentAreaHeight &&
          scrollTop > 0;

        const fullHeightWillDisruptLongScrollPosition =
          isOverflowing && scrollTop >= scrollHeight - fullContentAreaHeight;

        const fullHeightWillDisruptScrollPosition =
          fullHeightWillDisruptShortScrollPosition ||
          fullHeightWillDisruptLongScrollPosition;

        dragState.current = {
          scrollHeight: scrollHeight,
          scrollTop: scrollTop,
          initialSheetDY: sheetDY,
          shouldStickToBottom:
            scrollTop >= scrollHeight - visibleContentAreaHeight,
          scrollHeightAboveFullContentAreaWhenFullHeight:
            Math.max(0, scrollHeight - fullContentAreaHeight),
          fullHeightWillDisruptScrollPosition:
            fullHeightWillDisruptScrollPosition
        };
      }

      const { scrollHeight, scrollTop, initialSheetDY, shouldStickToBottom, scrollHeightAboveFullContentAreaWhenFullHeight, fullHeightWillDisruptScrollPosition } =
        dragState.current;

      let verticalDisplacement = 0;

      if (fullHeightWillDisruptScrollPosition) {
        const maybeStickToBottom = shouldStickToBottom
          ? sheetDY - initialSheetDY
          : 0;

        verticalDisplacement = -1 * (
          scrollTop - scrollHeightAboveFullContentAreaWhenFullHeight + maybeStickToBottom
          //scrollTop - scrollHeightAboveFullContentAreaWhenFullHeight + safeAreaInsetBottom + maybeStickToBottom
        );
      }

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
  }, [
    isDragging,
    sheetDY,
    safeAreaInsetBottom,
    offsetFromSheetTop,
    fullContentAreaHeight,
    visibleContentAreaHeight,
    visibleContentAreaHeightRatio,
    inverseVisibleContentAreaHeightRatio,
  ]);

  // When drag completes: Restore scroll position and clean up `dragState`.
  useEffect(() => {
    if (!isDragging && height !== "100%" && dragState.current !== null) {
      const scrollTop = dragState.current.scrollTop;
      scrollContainerRef.current.scroll(0, scrollTop, { behavior: "instant" });
      dragState.current = null;
    }
  }, [isDragging, height]);

  const viewportHeight = useViewportHeight();

  // DEBUG
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const scrollHeight = scrollContainer.scrollHeight;

    console.log("[FeatureSheet][ScrollableContent][useResizing] render: ", viewportHeight, safeAreaInsetBottom, sheetHeight, offsetFromSheetTop, scrollHeight);
  });
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
