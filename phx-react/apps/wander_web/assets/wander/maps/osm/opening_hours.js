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

import opening_hours from "opening_hours";

import { hmsDifference } from "/wander/common/date_times";

/**
 * @typedef {{weekday: string, shortWeekday: string, timeRanges: string[]}} WeekdayWithTimeRangeStrs
 */

// TODO: maybe use `null` instead of `undefined`?
/**
 * @typedef {{
 *   isOpen: boolean,
 *   stateStr: string,
 *   nextOpensOrClosesAt: Date | undefined,
 *   nextOpensOrClosesIn: Hms | undefined
 * }} OpenStateAtInstant
 */

/**
 * Returns information about the open or closed state of the `feature` at the
 * given date, otherwise `null` if `feature.properties.opening_hours` is not
 * valid.
 *
 * @param {Feature} feature
 * @param {Date} atDate
 *
 * @returns {(OpenStateAtInstant | null)}
 */
export function openStateAtInstant(feature, atDate = new Date()) {
  // TODO: Might not be necessary to create a new `oh` every time, especially
  //  since this is called at least once per minute when a sheet is open on a
  //  feature with a valid "opening_hours" tag. Overhead negligible or no?
  const oh = createOpeningHoursObject(feature);
  if (oh === null) {
    return null;
  }

  const nextWeek = new Date(atDate);
  nextWeek.setDate(atDate.getDate() + 6);
  nextWeek.setHours(23, 59, 59, 999);

  // TODO: handle "unknown"/conditional state and comments

  const isOpen = oh.getState(atDate);
  const stateStr = isOpen ? "Open" : "Closed";

  // TODO: Verify (and maybe unit test) that `oh.getNextChange` returns the
  //  next 'close' date if currently open, and next 'open' date if currently
  //  closed. I suspect the 'unknown' state needs to be accounted for as well,
  //  which might break this logic; we should understand how the
  //  'unknown'/conditional state interacts with all the logic in this module
  //  and make sure we've got things correct with unit tests.

  /** @type {(Date | undefined)} */
  const nextOpensOrClosesAt = oh.getNextChange(atDate, nextWeek);

  const nextOpensOrClosesIn =
    nextOpensOrClosesAt !== undefined
      ? hmsDifference(atDate, nextOpensOrClosesAt)
      : undefined;

  const result = {
    isOpen: isOpen,
    stateStr: stateStr,
    nextOpensOrClosesAt: nextOpensOrClosesAt,
    nextOpensOrClosesIn: nextOpensOrClosesIn,
  };

  return result;
}

/**
 * Returns a list of strings like "08:00-17:00" for all the "open" time ranges
 * for `numDays` starting from `startDate`.
 *
 * @param {Feature} feature
 * @param {Date} startDate
 * @param {integer} numDays
 *
 * @return {(WeekdayWithTimeRangeStrs[] | null)}
 */
export function weekdaysWithTimeRangeStrs(
  feature,
  startDate = new Date(),
  numDays = 7
) {
  const oh = createOpeningHoursObject(feature);
  if (oh === null) {
    return null;
  }

  // TODO: calculate locale, timezone, format preferences, etc. from account preferences
  const localeTag = undefined;
  const [weekdayFormatter, shortWeekdayFormatter, timeRangeFormatter] =
    dateFormatters(localeTag);

  /** @type {WeekdayWithTimeRangeStrs[]} */
  const weekdaysWithTimeRangeStrs = [];

  let currentDate = startDate;
  currentDate.setHours(0, 0, 0, 0);

  for (let day = 0; day < numDays; day++) {
    const today = new Date(currentDate);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 59);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const weekday = weekdayFormatter.format(today);
    const shortWeekday = shortWeekdayFormatter.format(today);
    const timeRanges = openingHoursTimeRangeStrsForDay(
      today,
      endOfToday,
      oh,
      timeRangeFormatter
    );

    const weekdayWithTimeRangeStrs = {
      weekday: weekday,
      shortWeekday: shortWeekday,
      timeRanges: timeRanges,
    };
    weekdaysWithTimeRangeStrs.push(weekdayWithTimeRangeStrs);

    currentDate = tomorrow;
  }

  return weekdaysWithTimeRangeStrs;
}

/**
 * Returns a list of strings like "08:00-17:00" for all the "open" time ranges
 * for `date`, as reported by `openingHours`.
 *
 * @param {Date} day
 * @param {Date} dayAfter - The day after `day`. Used to limit the query for
 *  opening hours from `oh.`
 * @param {opening_hours} openingHours
 * @param {Intl.DateTimeFormat} timeRangeFormatter
 *
 * @returns {string[]}
 */
function openingHoursTimeRangeStrsForDay(
  day,
  dayAfter,
  openingHours,
  timeRangeFormatter
) {
  const openIntervals = openingHours.getOpenIntervals(day, dayAfter);
  const timeRangeStrs = [];

  for (const openInterval of openIntervals) {
    const from = openInterval[0];
    const to = openInterval[1];

    // TODO: use "unknown"/conditional state and comment in `oi[2]` and `oi[3]`

    const timeRangeStr = timeRangeFormatter.formatRange(from, to);
    timeRangeStrs.push(timeRangeStr);
  }

  return timeRangeStrs;
}

/**
 * Returns an `opening_hours.js` object if `feature.properties.opening_hours`
 * is valid, otherwise `null`.
 *
 * @param {Feature} feature
 *
 * @returns {(opening_hours | null)}
 */
function createOpeningHoursObject(feature) {
  const osmOpeningHoursStr = feature.properties.opening_hours;

  if (
    osmOpeningHoursStr === undefined ||
    osmOpeningHoursStr === null ||
    osmOpeningHoursStr === ""
  ) {
    return null;
  }

  const nominatimObject = createNominatimObject(feature);
  const ohOpts = { mode: 0, tag_key: "opening_hours" };
  const oh = new opening_hours(osmOpeningHoursStr, nominatimObject, ohOpts);
  return oh;
}

function createNominatimObject(feature) {
  const geometryType = feature.geometry.type;
  if (geometryType !== "Point") {
    console.error(
      "[createNominatimObject] not implemented for geometry type '${geometryType}'"
    );
    return null;
  }

  const [latitude, longitude] = feature.geometry.coordinates;

  // TODO: Query for address from enclosing features.
  const countryCode = "ca";
  const province = "Alberta";

  const nominatimObject = {
    lat: latitude,
    lon: longitude,
    address: { country_code: countryCode, state: province },
  };

  return nominatimObject;
}

function dateFormatters(localeTag) {
  const weekdayFormatOpts = { weekday: "long" };
  const weekdayFormatter = new Intl.DateTimeFormat(
    localeTag,
    weekdayFormatOpts
  );

  const shortWeekdayFormatOpts = { weekday: "short" };
  const shortWeekdayFormatter = new Intl.DateTimeFormat(
    localeTag,
    shortWeekdayFormatOpts
  );

  const timeRangeFormatOpts = {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  };
  const timeRangeFormatter = new Intl.DateTimeFormat(
    localeTag,
    timeRangeFormatOpts
  );

  return [weekdayFormatter, shortWeekdayFormatter, timeRangeFormatter];
}
