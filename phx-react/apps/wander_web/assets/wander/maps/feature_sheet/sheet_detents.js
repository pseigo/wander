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

import { useEffect, useState } from "react";

import * as Config from "/wander/common/config";
import { getSafeAreaInset } from "/wander/common/documents";

/**
 * A 'detent' represents a particular dY (vertical displacement in pixels) that
 * a UI sheet 'snaps' to.
 *
 * - "small" represents the smallest size a sheet can be collapsed to.
 * - "medium" shows a bit more and typically covers 40-60% of the viewport.
 * - "large" typically fills the entire viewport, sometimes with a small gap at
 *   the top to remind the user there's still something behind the sheet.
 *
 * Detents are a tool that can be used for many different reasons. One reason
 * is to plan and control how much of a sheet is visible to a user. While you
 * _could_ allow users to resize a sheet free-form without snapping to detents,
 * there's a risk that they won't pull up the sheet enough to see the elements
 * you want them to see, potentially causing them to feel 'lost' in your UI.
 * Conversely, the user may pull the sheet up 'too much', revealing information
 * that likely isn't relevant to them at the time, which may overwhelm.
 * Application developers can use detents to (statically or dynamically)
 * calculate how much of a sheet a user should see in the sheet's smallest and
 * largest expanded states.
 *
 * There are other possible reasons for using detents as well. For example,
 * they can simplify handling screen resizes. e.g., Web browser window resizing
 * on a computer, smartphone toolbars expanding and collapsing automatically,
 * or a smartphone being rotated from portrait to landscape orientation or vice
 * versa. Even if a viewport resize causes elements to shift around in strange
 * ways, with detents you can have confidence that your sheets will display
 * exactly what you want the user to see before, during, and after the resize.
 *
 * One more use case worth mentioning is swipe gestures. The first iteration of
 * a sheet implementation may allow the user to expand and collapse the sheet
 * by dragging it from where it is to where they would like it to be, e.g.,
 * from the bottom of the screen to the top of screen. If sheets are a
 * prominent interface element in the application, we can make this interaction
 * a bit easier and less tiresome with swipe gestures. The second iteration of
 * the sheet implementation may allow the user to perform a short swipe up or
 * down gesture (both in terms of time and the distance their finger or cursor
 * travels). If the only detents used are "small" and "large", this may work
 * fine on its own. But what if we are using sheets because we very
 * specifically want the user to still see the elements underneath it? Then we
 * would also have a "medium" detent. Without detent snapping, swiping would be
 * like curling (a game of sliding stones on ice toward a target). With
 * detents, swipe gestures don't have to be precise to land where the
 * application designers want them to land. With the number of final UI states
 * simplified from hundreds to two or three, we gain space to add more layers
 * of interaction, such as expanding or collapsing to 'further' detents by
 * swiping faster.
 *
 * These are only a few reasons that the 'detent' pattern is a useful tool for
 * designers using sheets in their applications. The purpose of this aside is
 * to help anyone unfamiliar with the pattern understand what it's about, and
 * in turn hopefully more easily understand the intent of code that uses it.
 *
 * @typedef {("small" | "medium" | "large")} SheetDetent
 */

export function useSheetDetents(
  setDY,
  completedDrag,
  setCompletedDrag,
  viewportHeight,
  headerHeight
) {
  const [detentDYs, setDetentDYs] = useState({ small: 0, medium: 0, large: 0 });
  const [currentDetent, setCurrentDetent] = useState(initialDetent());

  // Update detent dYs when relevant element heights change, such as the
  // viewport or sheet header.
  useEffect(() => {
    const smallDetentDY = calculateSmallDetentDY(headerHeight);
    const mediumDetentDY = calculateMediumDetentDY(viewportHeight);
    const largeDetentDY = calculateLargeDetentDY(viewportHeight);

    setDetentDYs({
      small: smallDetentDY,
      medium: mediumDetentDY,
      large: largeDetentDY,
    });
  }, [viewportHeight, headerHeight]);

  // Adjust current dY when the current detent or detentDYs change.
  useEffect(() => {
    setDY(detentDYs[currentDetent]);
  }, [detentDYs, currentDetent]);

  // Calculate next detent when drag ends.
  // "drag_complete": {initialDY, finalDY}
  useEffect(() => {
    // For our nulling at the end of this effect.
    if (completedDrag === null) {
      return;
    }

    const { initialDY, finalDY, pixelsPerSecond } = completedDrag;
    let nextDetent = currentDetent;

    // TODO: Test these magic `pixelsPerSecond` thresholds on various different
    //  touchscreen devices.
    if (pixelsPerSecond >= 1950) {
      nextDetent = furthestDetentInSameDirection(initialDY, finalDY);
    } else if (pixelsPerSecond >= 400) {
      nextDetent = nextDetentInSameDirection(initialDY, finalDY, currentDetent);
    } else {
      nextDetent = detentZoneOfDY(finalDY, detentDYs);
    }

    if (nextDetent !== currentDetent) {
      setCurrentDetent(nextDetent);
    } else {
      setDY(detentDYs[currentDetent]);
    }

    setCompletedDrag(null);
  }, [completedDrag]);

  return [currentDetent];
}

/**
 * @returns {SheetDetent}
 */
function initialDetent() {
  const defaultDetent = "small";

  if (Config.get("enabled", "debug") === true) {
    return (
      Config.get("map.feature_sheet.initial.detent", "debug") || defaultDetent
    );
  }

  return defaultDetent;
}

function calculateSmallDetentDY(headerHeight) {
  const pixelsAbove = 15; // sheet content padding (14px) + drag handle breathing room (1px)
  const pixelsBelow = 10; // navbar margin-top (10px)
  const safeAreaInsetBottom = getSafeAreaInset("bottom");
  const detentDY =
    -1 * (pixelsAbove + headerHeight + pixelsBelow + safeAreaInsetBottom);
  return detentDY;
}

function calculateMediumDetentDY(viewportHeight) {
  const detentDY = -1 * Math.floor(viewportHeight / 2);
  return detentDY;
}

function calculateLargeDetentDY(viewportHeight) {
  const safeAreaInsetBottom = getSafeAreaInset("bottom");
  const breathingRoom = 40;
  const detentDY = -1 * (viewportHeight + safeAreaInsetBottom - breathingRoom);
  return detentDY;
}

function detentZoneOfDY(dY, detentDYs) {
  const dYHalfwayBetweenSmallAndMediumDetents =
    Math.floor((detentDYs.medium - detentDYs.small) / 2) + detentDYs.small;

  const dYHalfwayBetweenMediumAndLargeDetents =
    Math.floor((detentDYs.large - detentDYs.medium) / 2) + detentDYs.medium;

  if (dY <= dYHalfwayBetweenMediumAndLargeDetents) {
    return "large";
  } else if (dY <= dYHalfwayBetweenSmallAndMediumDetents) {
    return "medium";
  } else {
    return "small";
  }
}

function furthestDetentInSameDirection(initialDY, finalDY) {
  const isGrowing = finalDY < initialDY;
  return isGrowing ? "large" : "small";
}

function nextDetentInSameDirection(initialDY, finalDY, currentDetent) {
  const detents = ["small", "medium", "large"];
  const currentDetentIndex = detents.findIndex((d) => d === currentDetent);
  const isGrowing = finalDY < initialDY;
  const nextDetentIndex = isGrowing
    ? Math.min(currentDetentIndex + 1, detents.length - 1)
    : Math.max(0, currentDetentIndex - 1);
  const nextDetent = detents.at(nextDetentIndex);
  return nextDetent;
}
