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
import { Link as WouterLink } from "wouter";

/**
 * The brightness of a link's background. Used to make the link more legible.
 *
 * - "light" indicates a light background, resulting in a darker link.
 * - "dark" indicates a dark background, resulting in a lighter link.
 * - "auto" assumes the background is "light" in light mode, or "dark" in dark mode.
 * - "auto_invert" assumes the background is "dark" in light mode, or "light" in dark mode.
 *
 * To clarify, "light" and "dark" assume the background does NOT change between
 * light and dark mode. "auto" and "auto_invert" flip between styles for
 * "light" and "dark" backgrounds based on whether the site is currently in
 * light mode or dark mode.
 *
 * @typedef {("light" | "dark" | "auto" | "auto_invert")} LinkBackground
 */

/**
 * @param {object} props
 * @param {ReactElement} props.children
 * @param {boolean} props.newTab - Opens in a new tab or window (depending on
 *  the user's browser settings) when `true`, otherwise opens in the tab where
 *  it is clicked (navigates away from the current page). Defaults to `false`.
 * @param {LinkBackground} props.background - Defaults to "auto".
 * @param {boolean} props.unstyled - If `true` does not style the link. Defaults to `false`.
 * @param {(string | string[] | null)} props.className
 */
export function InternalLink(props) {
  const {
    children,
    newTab = false,
    background = "auto",
    unstyled = false,
    className = null,
  } = props;

  // TODO: Don't put `background` on element. Only accept global attributes and <a> attributes. Figure out simple way to document and process taking global attributes and element-specific attributes until/if we use TypeScript.
  if (newTab === true) {
    return (
      <a
        className={clsx([classesForLink(background, unstyled, className)])}
        target="_blank"
        {...props}
      >
        {children}
      </a>
    );
  } else {
    return (
      <WouterLink
        {...props}
        className={clsx([classesForLink(background, unstyled, className)])}
      >
        {children}
      </WouterLink>
    );
  }
}

/**
 * @param {object} props
 * @param {ReactElement} props.children
 * @param {boolean} props.newTab - Opens in a new tab or window (depending on
 *  the user's browser settings) when `true`, otherwise opens in the tab where
 *  it is clicked (navigates away from the current page). Defaults to `true`.
 * @param {LinkBackground} props.background - Defaults to "auto".
 * @param {boolean} props.unstyled - If `true` does not style the link. Defaults to `false`.
 * @param {(string | string[] | null)} props.className
 */
export function ExternalLink(props) {
  const {
    children,
    newTab = true,
    background = "auto",
    unstyled = false,
    className = null,
  } = props;

  // TODO: Don't put `background` on element. Only accept global attributes and <a> attributes. Figure out simple way to document and process taking global attributes and element-specific attributes until/if we use TypeScript.
  // TODO: Merge custom 'rel' string with privacy/security presets, and make sure the 'rel' we set doesn't get overridden. e.g., rel="help"
  // TODO: Make sure we're using the appropriate attributes for privacy/security.
  return (
    <a
      {...props}
      className={clsx([classesForLink(background, unstyled, className)])}
      target={!!newTab && "_blank"}
      rel="noreferrer noopener"
    >
      {children}
    </a>
  );
}

function classesForLink(background, unstyled, className) {
  return [
    "decoration-[1.5px]",
    !unstyled && ["hover:underline", classesForBackground(background)],
    className,
  ];
}

/**
 * @param {LinkBackground} background
 * @returns {(string | string[])}
 */
function classesForBackground(background) {
  switch (background) {
    case "light":
      return "text-[rgb(36,109,225)] hover:text-[rgb(78,137,230)]";

    case "dark":
      return "text-[rgb(107,156,234)] hover:text-[rgb(138,178,242)]";

    case "auto":
      return [
        "text-[rgb(36,109,225)] hover:text-[rgb(78,137,230)]",
        "dark:text-[rgb(107,156,234)] dark:hover:text-[rgb(138,178,242)]",
      ];

    case "auto_invert":
      return [
        "text-[rgb(107,156,234)] hover:text-[rgb(138,178,242)]",
        "dark:text-[rgb(36,109,225)] dark:hover:text-[rgb(78,137,230)]",
      ];
  }
}
