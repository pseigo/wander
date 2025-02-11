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

import { exclusiveRange } from "/wander/common/ranges";

const k_columnDivider = "|";

/**
 * Returns a Markdown table from `rows`.
 *
 * The first sub-array is the header. All rows are rendered in columns
 * according to sub-array indices.
 *
 * @param {[[string]]} rows - Table contents in left-to-right row order.
 * @param {object} opts
 * @param {number} opts.padding - Defaults to 0.
 *
 * @returns {string}
 */
export function toMarkdownTable(rows, opts) {
  if (rows.length === 0) {
    return "";
  }

  opts = { padding: 0, ...opts };

  const columnContentWidths = calculateColumnContentWidths(rows);

  let rowStrs = [rowToStr(rows[0], columnContentWidths, opts.padding)];

  if (rows.length > 1) {
    rowStrs.push(
      headerSeparatorStr(rows[0].length, columnContentWidths, opts.padding)
    );
  }

  rows.shift();
  rowStrs = [
    ...rowStrs,
    ...rows.map((row) => rowToStr(row, columnContentWidths, opts.padding)),
  ];

  const tableStr = rowStrs.reduce((acc, s) => acc + "\n" + s);
  return tableStr;
}

/**
 * Returns the width in UTF-16 code units each column should allocate for its
 * content according to the column's longest cell.
 *
 * @example `columnWidths([["A", "B"], ["a", "b"]]) //=> [1, 1]`
 * @example `columnWidths([["A", "B"], ["aaa", "b"]]) //=> [3, 1]`
 *
 * @param {[[string]]} rows - Table contents in left-to-right row order, where
 *  the first element is the header.
 *
 * @requires All rows have the same iterable length.
 */
const calculateColumnContentWidths = (rows) =>
  rows.reduce(
    (acc, row) =>
      row.map((cell, columnIndex) => Math.max(cell.length, acc[columnIndex])),
    new Array(rows[0]?.length ?? 0).fill(0)
  );

/**
 * @param {[string]} row
 * @param {integer} contentWidths
 * @param {integer} paddingSize
 *
 * @returns {string}
 */
function rowToStr(row, contentWidths, paddingSize) {
  const padding = " ".repeat(paddingSize);

  return row.reduce((acc, cell, i) => {
    const gap = " ".repeat(contentWidths[i] - cell.length);
    return acc + padding + cell + gap + padding + k_columnDivider;
  }, k_columnDivider);
}

/**
 * @param {integer} numColumns
 * @param {integer} contentWidths
 * @param {integer} paddingSize
 *
 * @returns {string}
 */
function headerSeparatorStr(numColumns, contentWidths, paddingSize) {
  return exclusiveRange(0, numColumns)
    .map((ci) => "-".repeat(contentWidths[ci] + paddingSize * 2))
    .reduce((acc, column) => acc + column + k_columnDivider, k_columnDivider);
}
