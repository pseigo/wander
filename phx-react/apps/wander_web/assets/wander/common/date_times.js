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

// TODO: unit test all the functions in this module

/**
 * @typedef {{hours: integer, minutes: integer, seconds: integer}} Hms
 */

/**
 * Returns the hours, minutes, and seconds difference between `end` and
 * `start`.
 *
 * @param {Date} start
 * @param {Date} end
 *
 * @returns {Hms}
 */
export function hmsDifference(start, end) {
  const totalSeconds = (end - start) / 1000;

  const fractionalHours = totalSeconds / 60 / 60;
  const hours = Math.floor(fractionalHours);

  const fractionalMinutes = (fractionalHours - hours) * 60;
  const minutes = Math.floor(fractionalMinutes);

  const fractionalSeconds = (fractionalMinutes - minutes) * 60;
  const seconds = Math.floor(fractionalSeconds);

  const difference = {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };

  return difference;
}

// TODO: take timezone by param to make potential timezone bugs explicit
/**
 * @param {Date} dateOne
 * @param {Date} dateTwo
 *
 * @returns {boolean}
 */
export function areOnSameDay(dateOne, dateTwo) {
  return (
    dateOne.getDate() === dateTwo.getDate() &&
    dateOne.getMonth() === dateTwo.getMonth() &&
    dateOne.getFullYear() === dateTwo.getFullYear()
  );
}
