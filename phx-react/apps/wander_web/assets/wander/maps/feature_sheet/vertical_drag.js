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
 * @param {integer} initialDY - Initial vertical displacement in pixels
 *  (negative is up, positive is down). Defaults to `0`.
 *
 * @returns {[integer, boolean, mouseDownListener, touchStartListener]}
 *  `[dY, isDragging, onMouseDown, onStartStart]`
 */
export function useVerticalDrag(initialDY = 0) {
  // State used outside of renders.
  const dragRef = useRef({
    dY: initialDY,
    isDragging: false,
    draggingInitialDY: null,
    draggingInitialY: null,
  });

  // State used in renders (if the hook's client wishes to).
  const [dY, setDY] = useState(initialDY);
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

    const curriedOnContextMenu = (e) =>
      onContextMenu(e, dragRef, setIsDragging);

    window.addEventListener("mousemove", curriedOnMouseMove);
    window.addEventListener("touchmove", curriedOnTouchMove);

    window.addEventListener("mouseup", curriedOnMouseUp);
    window.addEventListener("touchend", curriedOnTouchEnd);
    window.addEventListener("touchcancel", curriedOnTouchEnd);

    window.addEventListener("contextmenu", curriedOnContextMenu);

    return () => {
      window.removeEventListener("contextmenu", curriedOnContextMenu);

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

/**
 * Possible `MouseEvent.button` values for mouse events **caused by** the
 * "depression or release of a mouse button"; `MouseEvent.button` is not
 * meaningful for `MouseEvent`s triggered by other causes.
 *
 * @see https://w3c.github.io/uievents/#dom-mouseevent-button
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
 */
const k_mouseButton = {
  /** e.g., left mouse button */
  primary: 0,

  /** e.g., middle mouse button, mouse wheel button */
  auxiliary: 1,

  /** e.g., right mouse button */
  secondary: 2,

  /** e.g., special 'back' button on a mouse */
  x1: 3,

  /** e.g., special 'forward' button on a mouse */
  x2: 4,
};

function onMouseDown(e, dragRef, setIsDragging) {
  const clientY = e.clientY;
  //console.log("[useVerticalDrag] mousedown", e, e.currentTarget, clientY, e.button);

  // prettier-ignore
  if (e.button === k_mouseButton.primary)
  {
    onDragStart(e, clientY, dragRef, setIsDragging);
  }
  else if (e.button === k_mouseButton.secondary)
  {
    // Fallback for `onContextMenu` due to the following behaviour:
    //
    // > Any right-click event that is not disabled (by calling the click
    // > event's `preventDefault()` method) will result in a `contextmenu`
    // > event being fired at the targeted element.
    // >
    // > **Note**: An exception to this in Firefox: if the user holds down the
    // > Shift key while right-clicking, then the context menu will be shown
    // > without a `contextmenu` event being fired.
    // >
    // > -- via https://web.archive.org/web/20250116015121/https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event
    // >
    // > (Mozilla Contributors, CC BY-SA 2.5)
    //
    onDragEnd(e, dragRef, setIsDragging);
  }
}

function onContextMenu(e, dragRef, setIsDragging) {
  //console.log("[useVerticalDrag] contextmenu", e, e.button);

  // End drag now because the application will not receive any "mouseup" events
  // while the system's context menu is open.
  onDragEnd(e, dragRef, setIsDragging);
}

function onMouseMove(e, dragRef, setDY) {
  //console.log("[useVerticalDrag] mousemove (dragging!)", e);
  onDragMove(e, e.clientY, dragRef, setDY);
}

function onMouseUp(e, dragRef, setIsDragging) {
  //console.log("[useVerticalDrag] mouseup", e, e.button);

  if (e.button === k_mouseButton.primary) {
    onDragEnd(e, dragRef, setIsDragging);
  }
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