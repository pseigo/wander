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

/**
 * Returns an iterable range for `[lowerBound, upperbound]`.
 *
 * @example `inclusiveRange(0, 0).toArray() //=> [0]`
 * @example `inclusiveRange(0, 2).toArray() //=> [0, 1, 2]`
 * @example `inclusiveRange(-2, 0).toArray() //=> [-2, -1, 0]`
 * @example `inclusiveRange(10, 15).toArray() //=> [10, 11, 12, 13, 14, 15]`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol
 *
 * @param {integer} lowerBound
 * @param {integer} upperBound
 *
 * @returns {Iterator}
 *
 * @requires `upperBound >= lowerBound`
 * @throws {RangeError} if `upperBound < lowerBound`
 *
 * @throws {TypeError} if `lowerBound` or `upperBound` is not an integer
 */
export function inclusiveRange(lowerBound, upperBound) {
  if (!Number.isInteger(lowerBound)) {
    throw new TypeError(
      `\`lowerBound\` (\`${lowerBound}\`) must be an integer`
    );
  }
  if (!Number.isInteger(upperBound)) {
    throw new TypeError(
      `\`upperBound\` (\`${upperBound}\`) must be an integer`
    );
  }
  if (upperBound < lowerBound) {
    throw new RangeError(
      `\`upperBound\` (${upperBound}) must be greater than or equal to \`lowerBound\` (${lowerBound})`
    );
  }

  const size = upperBound - lowerBound + 1;
  return new Array(size).keys().map((e) => e + lowerBound);
}

/**
 * Returns an iterable range for `[lowerBound, upperbound)`.
 *
 * @example `exclusiveRange(0, 0).toArray() //=> []`
 * @example `exclusiveRange(0, 2).toArray() //=> [0, 1]`
 * @example `exclusiveRange(-2, 0).toArray() //=> [-2, -1]`
 * @example `exclusiveRange(10, 15).toArray() //=> [10, 11, 12, 13, 14]`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol
 *
 * @param {integer} lowerBound
 * @param {integer} upperBound
 *
 * @returns {Iterator}
 *
 * @requires `upperBound >= lowerBound`
 * @throws {RangeError} if `upperBound < lowerBound`
 *
 * @throws {TypeError} if `lowerBound` or `upperBound` is not an integer
 */
export function exclusiveRange(lowerBound, upperBound) {
  if (!Number.isInteger(lowerBound)) {
    throw new TypeError(
      `\`lowerBound\` (\`${lowerBound}\`) must be an integer`
    );
  }
  if (!Number.isInteger(upperBound)) {
    throw new TypeError(
      `\`upperBound\` (\`${upperBound}\`) must be an integer`
    );
  }
  if (upperBound < lowerBound) {
    throw new RangeError(
      `\`upperBound\` (${upperBound}) must be greater than or equal to \`lowerBound\` (${lowerBound})`
    );
  }

  const size = upperBound - lowerBound;
  return new Array(size).keys().map((e) => e + lowerBound);
}
