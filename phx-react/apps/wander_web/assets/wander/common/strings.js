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

// TODO: unit test the functions in this module

/**
 * Returns a copy of `str` with the first character uppercased.
 *
 * @example
 * ```js
 * import { capitalize } from "/wander/common/strings";
 * console.log(capitalize("hello")); //=> "Hello"
 * console.log(capitalize(""));      //=> ""
 * ```
 *
 * @param {string} str
 *
 * @returns {string}
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function randomLowerAlphaNumericString() {
  return Math.random().toString(36).slice(2);
}
