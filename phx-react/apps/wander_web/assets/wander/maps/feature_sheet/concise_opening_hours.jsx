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
import { useRef, useState, memo } from "react";

import { areOnSameDay } from "/wander/common/date_times";

import { useLiveOpenState } from "./concise_opening_hours/live_open_state";

/**
 * @param {object} props
 * @param {Feature} props.feature
 * @param {boolean} props.compact - Slightly smaller text, for use in Info
 *  sheet rows. Defaults to `false`.
 *
 * @requires `feature.properties.opening_hours` exists.
 */
export const ConciseOpeningHours = memo(function ConciseOpeningHours({
  feature,
  compact = false,
  className,
}) {
  const openState = useLiveOpenState(feature);

  if (openState === null) {
    return null;
  }

  // TODO: calculate locale, timezone, format preferences, etc. from account preferences
  const localeTag = undefined;

  const nextOpensOrClosesStr = createNextOpensOrClosesStr(openState, localeTag);
  const untilNextOpenOrCloseDurationStr =
    createUntilNextOpenOrCloseDurationStr(openState);
  const [statusStr, classesForStatusStr] = createStatusStrAndClasses(openState);

  return (
    <div
      className={clsx([
        "flex flex-row gap-[5px]",
        compact ? "text-[.938rem]" : "text-[1rem]",
        className,
      ])}
    >
      <span className={clsx(["font-semibold", classesForStatusStr])}>
        {statusStr}
      </span>

      {openState.nextOpensOrClosesAt !== undefined && (
        <>
          <span aria-hidden="true">·</span>

          <div className="flex flex-row gap-1 items-baseline">
            <span>{nextOpensOrClosesStr}</span>
            {untilNextOpenOrCloseDurationStr !== undefined && (
              <span className="text-[#8a8a8a] text-[.813rem]">
                ({untilNextOpenOrCloseDurationStr})
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
});

/**
 * @param {OpenStateAtInstant} openState
 * @param {(string | undefined)} localeTag
 *
 * @returns {(string | undefined)}
 */
function createNextOpensOrClosesStr(openState, localeTag) {
  if (openState.nextOpensOrClosesAt === undefined) {
    return undefined;
  }

  let str = openState.isOpen ? "Closes " : "Opens ";

  const now = new Date();
  const nextOpensOrClosesADifferentDay = !areOnSameDay(
    now,
    openState.nextOpensOrClosesAt
  );
  if (nextOpensOrClosesADifferentDay) {
    const formatter = new Intl.DateTimeFormat(localeTag, { weekday: "short" });
    const shortWeekday = formatter.format(openState.nextOpensOrClosesAt);
    str += shortWeekday;
    str += ". ";
  }

  const timeFormatOpts = {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  };
  const timeFormatter = new Intl.DateTimeFormat(localeTag, timeFormatOpts);
  const timeStr = timeFormatter.format(openState.nextOpensOrClosesAt);
  str += timeStr;

  return str;
}

/**
 * @param {OpenStateAtInstant} openState
 *
 * @returns {(string | undefined)}
 */
function createUntilNextOpenOrCloseDurationStr(openState) {
  if (openState.nextOpensOrClosesIn === undefined) {
    return undefined;
  }
  let { hours, minutes } = openState.nextOpensOrClosesIn;

  let str = "";

  if (hours > 0) {
    str += `${hours}h`;
  }
  if (minutes > 0) {
    str += `${minutes}m`;
  }

  if (str === "") {
    str = "now";
  }

  return str;
}

/**
 * @param {OpenStateAtInstant} openState
 *
 * @returns {[string, string]} `[statusStr, classesForStatusStr]`
 */
function createStatusStrAndClasses(openState) {
  let statusStr = null;
  let classesForStatusStr = null;

  if (openState.isOpen) {
    if (
      openState.nextOpensOrClosesIn !== undefined &&
      openState.nextOpensOrClosesIn.hours === 0 &&
      openState.nextOpensOrClosesIn.minutes <= 30
    ) {
      statusStr = "Closing soon";
      classesForStatusStr = "text-[#b58500]";
    } else {
      statusStr = "Open";
      classesForStatusStr = "text-[#479768]";
    }
  } else {
    statusStr = "Closed";
    classesForStatusStr = "text-[#a00101]";
  }

  return [statusStr, classesForStatusStr];
}
