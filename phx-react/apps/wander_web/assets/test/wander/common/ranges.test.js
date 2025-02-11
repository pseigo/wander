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

import { describe, test, expect } from "@jest/globals";

import { toTable } from "/test/common/jest";
import { exclusiveRange, inclusiveRange } from "/wander/common/ranges";

const tableTestName = "[%#] %O";
const testTimeoutMs = 50;

// prettier-ignore
const descendingIntegerPairs = toTable([
  [0, -1],
  [0, -2],
  [1, -2],
  [1, 0],
  [10, 9],
  [-10, -11],
  [500000, -500000],
]);

// prettier-ignore
const nonIntegerPairs = toTable([
  [0, 1.1],
  [1.1, 2],
  [1.1, 2.2],

  [0, NaN],
  [NaN, 1],
  [NaN, NaN],

  [0, Infinity],
  [Infinity, 1],
  [-Infinity, 0],
  [0, -Infinity],
  [-Infinity, Infinity],
  [Infinity, -Infinity],

  [0, "foo"],
  ["foo", 1],
  ["foo", "bar"],

  [0, {foo: "bar"}],
  [{foo: "bar"}, 1],
  [{foo: "bar"}, "baz"],
  ["baz", {foo: "bar"}],
  [{foo: "bar"}, {baz: "zip"}],
]);

describe("calling `inclusiveRange/1`", () => {
  // prettier-ignore
  const expectedElementsForNonDescendingIntegerPairs = toTable([
    { pair: [0, 0], expectedElements: [0] },
    { pair: [0, 1], expectedElements: [0, 1] },
    { pair: [0, 2], expectedElements: [0, 1, 2] },

    { pair: [0, 2.0], expectedElements: [0, 1, 2] },
    { pair: [-1, 3.000000000], expectedElements: [-1, 0, 1, 2, 3] },
  ]);
  describe("returns `Iterator` with correct elements for non-descending integer pairs", () => {
    doRangeTests(inclusiveRange, expectedElementsForNonDescendingIntegerPairs);
  });

  describe("throws `RangeError` for descending integer pairs", () => {
    doThrowingRangeTests(inclusiveRange, descendingIntegerPairs, RangeError);
  });

  describe("throws `TypeError` for non-integer arguments", () => {
    doThrowingRangeTests(inclusiveRange, nonIntegerPairs, TypeError);
  });
});

describe("calling `exclusiveRange/1`", () => {
  // prettier-ignore
  const expectedElementsForNonDescendingIntegerPairs = toTable([
    { pair: [0, 0], expectedElements: [] },
    { pair: [0, 1], expectedElements: [0] },
    { pair: [0, 2], expectedElements: [0, 1] },

    { pair: [0, 2.0], expectedElements: [0, 1] },
    { pair: [-1, 3.000000000], expectedElements: [-1, 0, 1, 2] },
  ]);
  describe("returns `Iterator` with correct elements for non-descending integer pairs", () => {
    doRangeTests(exclusiveRange, expectedElementsForNonDescendingIntegerPairs);
  });

  describe("throws `RangeError` for descending integer pairs", () => {
    doThrowingRangeTests(exclusiveRange, descendingIntegerPairs, RangeError);
  });

  describe("throws `TypeError` for non-integer arguments", () => {
    doThrowingRangeTests(exclusiveRange, nonIntegerPairs, TypeError);
  });
});

/**
 * @param {function} createRange
 * @param {JestTable} expectedElementsForPairs
 */
function doRangeTests(createRange, expectedElementsForPairs) {
  if (expectedElementsForPairs.length === 0) {
    return;
  }

  test.each(expectedElementsForPairs)(
    tableTestName,
    ({ pair, expectedElements }) => {
      expect(createRange(...pair)?.toArray()).toStrictEqual(expectedElements);
    },
    testTimeoutMs
  );
}

/**
 * @param {function} createRange
 * @param {JestTable} pairs
 * @param {Error} expectedError
 */
function doThrowingRangeTests(createRange, pairs, expectedError) {
  if (pairs.length === 0) {
    return;
  }

  test.each(pairs)(
    tableTestName,
    (pair) => {
      expect(() => createRange(...pair)).toThrow(expectedError);
    },
    testTimeoutMs
  );
}
