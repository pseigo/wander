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

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A hook for tracking vertical drag gestures on a DOM element. Supports both
 * mouse and touch gestures.
 *
 * ## Return values
 *
 * - `dY` - The current vertical displacement in pixels. Use this value for
 *   vertical translations on your element.
 *   - Initializes to `0`.
 *   - Negative `dY` represents an 'upwards' displacement.
 *   - Positive `dY` represents a 'downwards' displacement.
 *
 * - `isDragging` - `true` if the element is currently being dragged.
 *
 * - `onMouseDown` - The listener to register on the draggable element's "mousedown" event.
 * - `onTouchStart` - The listener to register on the draggable element's "touchstart" event.
 *
 * @returns {[integer, boolean, mouseDownListener, touchStartListener]}
 *  `[dY, isDragging, onMouseDown, onStartStart]`
 */
export function useVerticalDrag() {
  // State used outside of renders.
  const dragRef = useRef({
    dY: 0,
    isDragging: false,
    draggingInitialDY: null,
    draggingInitialY: null,
  });

  // State used in renders (if the hook's client wishes to).
  const [dY, setDY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Event listeners to be registered on the draggable DOM Element.
  const curriedOnMouseDown = useCallback(
    (e) => onMouseDown(e, dragRef, setIsDragging),
    [dragRef, setIsDragging]
  );
  const curriedOnTouchStart = useCallback(
    (e) => onTouchStart(e, dragRef, setIsDragging),
    [dragRef, setIsDragging]
  );

  // Event listeners that should fire even if the cursor leaves the draggable
  // DOM Element.
  useEffect(() => {
    const curriedOnMouseMove = (e) => onMouseMove(e, dragRef, setDY);
    const curriedOnTouchMove = (e) => onTouchMove(e, dragRef, setDY);

    const curriedOnMouseUp = (e) => onMouseUp(e, dragRef, setIsDragging);
    const curriedOnTouchEnd = (e) => onTouchEnd(e, dragRef, setIsDragging);

    window.addEventListener("mousemove", curriedOnMouseMove);
    window.addEventListener("touchmove", curriedOnTouchMove);

    window.addEventListener("mouseup", curriedOnMouseUp);
    window.addEventListener("touchend", curriedOnTouchEnd);
    window.addEventListener("touchcancel", curriedOnTouchEnd);

    return () => {
      window.removeEventListener("touchcancel", curriedOnTouchEnd);
      window.removeEventListener("touchend", curriedOnTouchEnd);
      window.removeEventListener("mouseup", curriedOnMouseUp);

      window.removeEventListener("touchmove", curriedOnTouchMove);
      window.removeEventListener("mousemove", curriedOnMouseMove);
    };
  }, []);

  return [dY, isDragging, curriedOnMouseDown, curriedOnTouchStart];
}

// .---------------------------------------------------------------.
// | property          | used in render? | used in event listener? |
// |-------------------+-----------------+-------------------------|
// | dY                |        x        |            x            |
// | isDragging        |        x (*)    |            x            |
// | draggingInitialDY |                 |            x            |
// | draggingInitialY  |                 |            x            |
// '-------------------|-----------------|-------------------------'
//
// (*) = only for debug purposes

function onMouseDown(e, dragRef, setIsDragging) {
  const clientY = e.clientY;
  //console.log("[useVerticalDrag] mousedown", e, e.currentTarget, clientY);
  onDragStart(e, clientY, dragRef, setIsDragging);
}

function onMouseMove(e, dragRef, setDY) {
  //console.log("[useVerticalDrag] mousemove (dragging!)", e);
  onDragMove(e, e.clientY, dragRef, setDY);
}

function onMouseUp(e, dragRef, setIsDragging) {
  //console.log("[useVerticalDrag] mouseup", e);
  onDragEnd(e, dragRef, setIsDragging);
}

function onTouchStart(e, dragRef, setIsDragging) {
  const clientY = e.touches.item(0).clientY;
  //console.log("[useVerticalDrag] touchstart", e, e.currentTarget, clientY);
  onDragStart(e, clientY, dragRef, setIsDragging);
}

function onTouchMove(e, dragRef, setDY) {
  const clientY = e.touches.item(0).clientY;
  //console.log("[useVerticalDrag] touchmove (dragging!)", e, clientY);
  onDragMove(e, clientY, dragRef, setDY);
}

function onTouchEnd(e, dragRef, setIsDragging) {
  //console.log("[useVerticalDrag] touchend", e);
  onDragEnd(e, dragRef, setIsDragging);
}

function onDragStart(e, clientY, dragRef, setIsDragging) {
  //console.log("[useVerticalDrag] dragstart", e, e.currentTarget);

  dragRef.current.isDragging = true;
  setIsDragging(true);

  const initialY = clientY;

  dragRef.current.draggingInitialDY = dragRef.current.dY;
  dragRef.current.draggingInitialY = initialY;
}

function onDragMove(e, clientY, dragRef, setDY) {
  if (dragRef.current.isDragging === false) {
    return;
  }
  //console.log("[useVerticalDrag] dragmove (dragging!)", e, e.currentTarget);

  const newY = clientY;
  const newDY =
    newY - dragRef.current.draggingInitialY + dragRef.current.draggingInitialDY;

  dragRef.current.dY = newDY;
  setDY(newDY);
}

function onDragEnd(e, dragRef, setIsDragging) {
  if (dragRef.current.isDragging === true) {
    //console.log("[useVerticalDrag] dragend", e, e.currentTarget);

    dragRef.current.isDragging = false;
    setIsDragging(false);

    dragRef.current.draggingInitialDY = null;
    dragRef.current.draggingInitialY = null;
  }
}
