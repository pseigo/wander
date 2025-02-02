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
 * Returns a new array containing all the elements from `array`, but `withElement` in between each one.
 *
 * @example
 * ```js
 * import { intersperse } from "/wander/common/arrays";
 *
 * const nums = [1, 2, 3];
 * const interspersed = intersperse(nums, ", ");
 * const prettyStr = interspersed.reduce((acc, e) => acc + e, "");
 *
 * console.log(interspersed); //=> [1, ", ", 2, ", ", 3]
 * console.log(prettyStr);    //=> "1, 2, 3"
 * ```
 *
 * @param {Array} array
 * @param {any} withElement
 *
 * @returns {Array}
 */
export function intersperse(array, withElement) {
  const interspersedArray = [];

  for (let i = 0; i < array.length; i++) {
    interspersedArray.push(array[i]);
    interspersedArray.push(withElement);
  }

  if (interspersedArray.length !== 0) {
    interspersedArray.pop();
  }

  return interspersedArray;
}
