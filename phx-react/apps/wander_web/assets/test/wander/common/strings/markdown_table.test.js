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
import { toMarkdownTable } from "/wander/common/strings/markdown_table";

const tableTestName = "[%#] %O";
const testTimeoutMs = 50;

describe("calling `toMarkdownTable/1`", () => {
  // prettier-ignore
  const expectedTablesForRows = toTable([
    {
      rows: [],
      opts: undefined,
      expectedTable: ""
    },
    {
      rows: [
        ["Title"],
        ["Row 1"],
        ["Row 2"],
        ["Row 3"]
      ],
      opts: undefined,
      expectedTable: "|Title|\n|-----|\n|Row 1|\n|Row 2|\n|Row 3|"
    },
    {
      rows: [
        ["Title"],
        ["Row 1"],
        ["Row 2"],
        ["Row 3"]
      ],
      opts: { padding: 1 },
      expectedTable: "| Title |\n|-------|\n| Row 1 |\n| Row 2 |\n| Row 3 |"
    },
    {
      rows: [
        ["Title 1", "Title 2", "Title 3"],
        ["Row 1.1", "Row 2.1", "Row 3.1"],
        ["Row 1.2", "Row 2.2", "Row 3.2"],
        ["Row 1.3", "Row 2.3", "Row 3.3"]
      ],
      opts: undefined,
      expectedTable: "|Title 1|Title 2|Title 3|\n|-------|-------|-------|\n|Row 1.1|Row 2.1|Row 3.1|\n|Row 1.2|Row 2.2|Row 3.2|\n|Row 1.3|Row 2.3|Row 3.3|"
    },
    {
      rows: [
        ["Title 1", "Title 2", "Title 3"],
        ["Row 1.1", "Row 2.1", "Row 3.1"],
        ["Row 1.2", "Row 2.2", "Row 3.2"],
        ["Row 1.3", "Row 2.3", "Row 3.3"]
      ],
      opts: { padding: 2 },
      expectedTable: "|  Title 1  |  Title 2  |  Title 3  |\n|-----------|-----------|-----------|\n|  Row 1.1  |  Row 2.1  |  Row 3.1  |\n|  Row 1.2  |  Row 2.2  |  Row 3.2  |\n|  Row 1.3  |  Row 2.3  |  Row 3.3  |"
    },
  ]);

  describe("renders tables correctly", () => {
    test.each(expectedTablesForRows)(
      tableTestName,
      ({ rows, opts, expectedTable }) => {
        expect(toMarkdownTable(rows, opts)).toBe(expectedTable);
      },
      testTimeoutMs
    );
  });
});
