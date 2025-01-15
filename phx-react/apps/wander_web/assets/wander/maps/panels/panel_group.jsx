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

/**
 * Where to anchor a `PanelGroup` to.
 * @typedef {("top-left" | "top-right" | "bottom-right" | "bottom-left")} PanelGroupPosition
 */

/**
 * Which direction to stack a `PanelGroup`'s children.
 * @typedef {("vertical" | "horizontal")} PanelGroupStackDirection
 */

/**
 * @param {object} props
 * @param {ReactNode} props.children
 * @param {PanelGroupPosition} props.position - Required.
 * @param {PanelGroupStackDirection} props.stack - Defaults to "vertical".
 */
export function PanelGroup({ children, position, stack = "vertical" }) {
  return (
    // prettier-ignore
    <div
      className={clsx([
        "absolute z-[1]", classesForPosition(position),
        "flex", classesForStackDirection(stack),
      ])}
    >
      {children}
    </div>
  );
}

/**
 * @param {PanelGroupPosition} position
 *
 * @returns {(string | string[])}
 */
function classesForPosition(position) {
  switch (position) {
    case "top-left":
      return "top-0 left-0";

    case "top-right":
      return "top-0 right-0";

    case "bottom-right":
      return "bottom-0 right-0";

    case "bottom-left":
      return "bottom-0 left-0";
  }

  throw new Error(`[PanelGroup] '${position}' is not a valid \`PanelGroupPosition\``);
}

/**
 * @param {PanelGroupStackDirection} stackDirection
 *
 * @returns {(string | string[])}
 */
function classesForStackDirection(stackDirection) {
  switch (stackDirection) {
    case "vertical":
      return "flex-col";

    case "horizontal":
      return "flex-row";
  }

  throw new Error(`[PanelGroup] '${stackDirection}' is not a valid \`PanelGroupStackDirection\``);
}
