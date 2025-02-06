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
 * A 2D array for use with Jest's table APIs.
 *
 * @typedef {[[any]]} JestTable
 *
 * @see https://jestjs.io/docs/api#testeachtablename-fn-timeout
 * @see https://jestjs.io/docs/api#each
 */

/**
 * Encloses each element in `xs` in an array for passing into Jest's
 * `test.each`. If some `x` is already `[...]`, it will become `[[...]]`.
 *
 * ## Rationale
 *
 * From the Jest (v29.7) API docs for `test.each`:
 *
 * > If you pass in a 1D array of primitives, internally it will be mapped to a
 * > table i.e. `[1, 2, 3] -> [[1], [2], [3]]`
 * >
 * > -- https://github.com/jestjs/jest/blob/bacb7de30d053cd87181294b0c8a8576632a8b02/website/versioned_docs/version-29.7/GlobalAPI.md#testeachtablename-fn-timeout
 *
 * If your test inputs sometimes have a mix of arrays and non-arrays and you
 * try to pass in `["a", "b" ["c"]]` sometimes and `[["a"], "b", "c"]` other
 * times, Jest might wrap all of your elements in an array to make them table
 * rows, but on the other hand it might instead see one of your elements is an
 * array, assume that means it's already formatted as a row, and then assume
 * the rest of your elements are formatted as rows even if they aren't; this
 * results in... surprising behaviour.
 *
 * A solution? Wrap all of your elements in arrays yourself so you don't have
 * to rely on Jest's guess. But `[[1], 2, 3]` is cleaner and easier to read
 * than `[[[1]], [2], [3]]`. That's where `toTable` comes in:
 * `toTable([[1], 2, 3])` returns `[[[1]], [2], [3]]`.
 *
 * Consider using `toTable` any time you have a mix of arrays and non-arrays in
 * your `test.each` inputs for consistent behaviour from Jest.
 *
 * @see https://jestjs.io/docs/api#testeachtablename-fn-timeout
 * @see https://jestjs.io/docs/api#each
 *
 * @param {[any]} xs
 *
 * @returns {JestTable}
 */
export function toTable(xs) {
  return xs.map((x) => [x]);
}
