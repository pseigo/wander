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
import * as Features from "/wander/maps/osm/features";

const tableTestName = "[%#] %O";
const testTimeoutMs = 50;

const sampleOpeningHoursValue = "Mo-Fr 07:00-21:00; PH off";

describe("calling `hasAnyTags/2`", () => {
  describe("on feature with no tags", () => {
    const feature = { properties: {} };

    // prettier-ignore
    const emptyQueries = toTable([
      [],
      {},
      [{}],
      [{}, {}, {}],
    ]);

    // prettier-ignore
    const nonMatchingQueries = toTable([
      "",
      [""],
      "amenity",
      ["amenity"],
      { amenity: "cafe" },
      { amenity: ["parking", "cafe"] },
      ["amenity", { amenity: ["parking", "cafe"] }],
    ]);

    describe("returns `false` for empty query", () => {
      doHasAnyTagsTests(feature, emptyQueries, false);
    });
    describe("returns `false` for non-matching query", () => {
      doHasAnyTagsTests(feature, nonMatchingQueries, false);
    });
  });

  describe("on feature with one single-valued tag", () => {
    // prettier-ignore
    const feature = {
      properties: {
        amenity: "cafe"
      }
    };

    // prettier-ignore
    const emptyQueries = toTable([
      [],
      {},
      [{}],
      [{}, {}, {}],
      { amenity: [] },
      [{ amenity: [] }],
    ]);

    // prettier-ignore
    const preciselyMatchingQueries = toTable([
      "amenity",
      ["amenity"],
      { amenity: "cafe" },
      [{ amenity: "cafe" }],
      ["amenity", { amenity: "cafe" }],
    ]);

    // prettier-ignore
    const matchingQueriesWithExtraneousNonMatchingPatterns = toTable([
      ["amenity", "cuisine"],
      { amenity: "cafe", cuisine: "bakery" },
      { amenity: "cafe", cuisine: ["bakery", "sandwich"] },
      [{ amenity: "cafe" }, { cuisine: ["bakery", "sandwich"] }],
      ["cuisine", { amenity: "cafe" }, { cuisine: "bakery" }, { cuisine: "sandwich" }],
    ]);

    // prettier-ignore
    const nonMatchingQueries = toTable([
      "",
      [""],
      " amenity ",
      { amenity: " cafe " },
      "cuisine",
      ["cuisine"],
      { cuisine: "bakery" },
      { cuisine: ["bakery", "sandwich"] },
      ["cuisine", { cuisine: ["bakery", "sandwich"] }],
    ]);

    describe("returns `false` for empty query", () => {
      doHasAnyTagsTests(feature, emptyQueries, false);
    });
    describe("returns `true` for precisely matching query", () => {
      doHasAnyTagsTests(feature, preciselyMatchingQueries, true);
    });
    describe("returns `true` for matching query with extraneous non-matching patterns", () => {
      // prettier-ignore
      doHasAnyTagsTests(feature, matchingQueriesWithExtraneousNonMatchingPatterns, true);
    });
    describe("returns `false` for non-matching query", () => {
      doHasAnyTagsTests(feature, nonMatchingQueries, false);
    });
  });

  describe("on feature with multiple single-valued tags", () => {
    // prettier-ignore
    const feature = {
      properties: {
        amenity: "cafe",
        cuisine: "bakery"
      }
    };

    // prettier-ignore
    const preciselyMatchingQueries = toTable([
      "amenity",
      "cuisine",
      ["amenity", "cuisine"],

      { amenity: "cafe" },
      { cuisine: "bakery" },

      { "amenity": "cafe", cuisine: "bakery" },
      [{ "amenity": "cafe" }, { cuisine: "bakery" }],

      ["amenity", { amenity: "cafe" }],
      ["cuisine", { cuisine: "bakery" }],
      ["amenity", { amenity: "cafe", cuisine: "bakery" }],
      ["amenity", "cuisine", { amenity: "cafe", cuisine: "bakery" }],
    ]);

    // prettier-ignore
    const matchingQueriesWithExtraneousNonMatchingPatterns = toTable([
      ["amenity", "opening_hours"],
      ["opening_hours", "cuisine", "amenity"],
      ["opening_hours", { amenity: "cafe" }],
      { amenity: "cafe", opening_hours: sampleOpeningHoursValue },
      ["opening_hours", { amenity: "cafe", opening_hours: sampleOpeningHoursValue }],
      ["opening_hours", { opening_hours: sampleOpeningHoursValue }, { amenity: "cafe" }],
    ]);

    // prettier-ignore
    const nonMatchingQueries = toTable([
      {},
      { amenity: "parking" },
      { amenity: "parking", cuisine: "sandwich" },

      "opening_hours",
      ["opening_hours", "internet_access"],
      { opening_hours: sampleOpeningHoursValue },
      ["opening_hours", "internet_access", { opening_hours: sampleOpeningHoursValue }],
      { opening_hours: sampleOpeningHoursValue, amenity: "parking", cuisine: "sandwich" },
    ]);

    describe("returns `true` for precisely matching query", () => {
      doHasAnyTagsTests(feature, preciselyMatchingQueries, true);
    });
    describe("returns `true` for matching query with extraneous non-matching patterns", () => {
      // prettier-ignore
      doHasAnyTagsTests(feature, matchingQueriesWithExtraneousNonMatchingPatterns, true);
    });
    describe("returns `false` for non-matching query", () => {
      doHasAnyTagsTests(feature, nonMatchingQueries, false);
    });
  });

  describe("on feature with multiple multi-valued tags", () => {
    // prettier-ignore
    const feature = {
      properties: {
        amenity: "parking;cafe",
        // Make sure empty list items and leading/trailing whitespace work
        cuisine: "bakery; ;; sandwich "
      }
    };

    // prettier-ignore
    const preciselyMatchingQueries = toTable([
      "amenity",
      "cuisine",
      ["amenity", "cuisine"],

      { amenity: "parking" },
      { amenity: "cafe" },
      { amenity: ["parking", "cafe"] },
      ["amenity", { amenity: "cafe" }],
      { amenity: "cafe", cuisine: "bakery" },
      { amenity: ["parking", "cafe"], cuisine: ["bakery", "sandwich"] },
    ]);

    // prettier-ignore
    const matchingQueriesWithExtraneousNonMatchingPatterns = toTable([
      ["opening_hours", "amenity"],
      ["opening_hours", "cuisine"],
      ["opening_hours", {cuisine: "sandwich"}],
      { opening_hours: sampleOpeningHoursValue, cuisine: "sandwich" },
      [{ opening_hours: sampleOpeningHoursValue }, { cuisine: "sandwich" }],
    ]);

    // prettier-ignore
    const nonMatchingQueries = toTable([
      { amenity: "parking_space" },
      { cuisine: "" },
      { cuisine: " " },
      { cuisine: " sandwich " },
    ]);

    describe("returns `true` for precisely matching query", () => {
      doHasAnyTagsTests(feature, preciselyMatchingQueries, true);
    });
    describe("returns `true` for matching query with extraneous non-matching patterns", () => {
      // prettier-ignore
      doHasAnyTagsTests(feature, matchingQueriesWithExtraneousNonMatchingPatterns, true);
    });
    describe("returns `false` for non-matching query", () => {
      doHasAnyTagsTests(feature, nonMatchingQueries, false);
    });
  });
});

describe("calling `hasAllTags/2`", () => {
  describe("on feature with no tags", () => {
    const feature = { properties: {} };

    // prettier-ignore
    const emptyQueries = toTable([
      [],
      {},
      [{}],
      [{}, {}, {}],
    ]);

    // prettier-ignore
    const nonMatchingQueries = toTable([
      "",
      [""],
      "amenity",
      ["amenity"],
      { amenity: "cafe" },
      { amenity: ["parking", "cafe"] },
      ["amenity", { amenity: ["parking", "cafe"] }],
    ]);

    describe("returns `false` for empty query", () => {
      doHasAnyTagsTests(feature, emptyQueries, false);
    });
    describe("returns `false` for non-matching query", () => {
      doHasAnyTagsTests(feature, nonMatchingQueries, false);
    });
  });

  describe("on feature with one single-valued tag", () => {
    // prettier-ignore
    const feature = {
      properties: {
        amenity: "cafe"
      }
    };

    // prettier-ignore
    const emptyQueries = toTable([
      [],
      {},
      [{}],
      [{}, {}, {}],
      { amenity: [] },
      [{ amenity: [] }],
    ]);

    // prettier-ignore
    const preciselyMatchingQueries = toTable([
      "amenity",
      ["amenity"],
      { amenity: "cafe" },
      [{ amenity: "cafe" }],
      ["amenity", { amenity: "cafe" }],
    ]);

    // prettier-ignore
    const partiallyMatchingQueriesWithExtraneousNonMatchingPatterns = toTable([
      ["amenity", "cuisine"],
      ["cuisine", { amenity: "cafe" }],
      { amenity: "cafe", cuisine: "bakery" },
      { amenity: "cafe", cuisine: ["bakery", "sandwich"] },
      [{ amenity: "cafe" }, { cuisine: ["bakery", "sandwich"] }],
      ["cuisine", { amenity: "cafe" }, { cuisine: "bakery" }, { cuisine: "sandwich" }],
    ]);

    // prettier-ignore
    const nonMatchingQueries = toTable([
      "",
      [""],
      { amenity: " cafe " },
      ["cuisine", { amenity: "cafe" }],

      "cuisine",
      ["cuisine"],
      { cuisine: "bakery" },
      { cuisine: ["bakery", "sandwich"] },
      ["cuisine", { cuisine: ["bakery", "sandwich"] }],
    ]);

    describe("returns `true` for empty query", () => {
      doHasAllTagsTests(feature, emptyQueries, true);
    });
    describe("returns `true` for precisely matching query", () => {
      doHasAllTagsTests(feature, preciselyMatchingQueries, true);
    });
    describe("returns `false` for partially matching query with extraneous non-matching patterns", () => {
      // prettier-ignore
      doHasAllTagsTests(feature, partiallyMatchingQueriesWithExtraneousNonMatchingPatterns, false);
    });
    describe("returns `false` for non-matching query", () => {
      doHasAllTagsTests(feature, nonMatchingQueries, false);
    });
  });

  describe("on feature with multiple single-valued tags", () => {
    // prettier-ignore
    const feature = {
      properties: {
        amenity: "cafe",
        cuisine: "bakery",
        internet_access: "yes",
        "internet_access:fee": "customers",
      }
    };

    // prettier-ignore
    const preciselyMatchingQueries = toTable([
      "amenity",
      "internet_access:fee",
      ["amenity", "cuisine"],
      ["amenity", "cuisine", "internet_access", "internet_access:fee"],

      { amenity: "cafe" },
      { amenity: "cafe", cuisine: "bakery" },
      ["amenity", { amenity: "cafe", cuisine: "bakery" }],
      ["amenity", "cuisine", { amenity: "cafe", cuisine: "bakery" }],
      ["amenity", "cuisine", { amenity: "cafe" }],
      { amenity: "cafe", cuisine: "bakery", internet_access: "yes", "internet_access:fee": "customers" },
      ["amenity", "cuisine", "internet_access", "internet_access:fee", { amenity: "cafe", cuisine: "bakery", internet_access: "yes", "internet_access:fee": "customers" }],

      ["amenity", { amenity: "cafe" }, "cuisine", { cuisine: "bakery" }],
      [{ amenity: "cafe" }, "amenity", "cuisine"],
    ]);

    // prettier-ignore
    const partiallyMatchingQueriesWithExtraneousNonMatchingPatterns = toTable([
      ["amenity", "name"],
      ["amenity", { amenity: "parking" }],
      ["name", { amenity: "cafe" }],
    ]);

    // prettier-ignore
    const nonMatchingQueries = toTable([
      "name",
      "amenityy",
      " amenity ",
      { amenity: "parking" },
      ["amenity", { cuisine: "sandwich" }],
      { cuisine: " bakery " },
    ]);

    describe("returns `true` for precisely matching query", () => {
      doHasAllTagsTests(feature, preciselyMatchingQueries, true);
    });
    describe("returns `false` for partially matching query with extraneous non-matching patterns", () => {
      // prettier-ignore
      doHasAllTagsTests(feature, partiallyMatchingQueriesWithExtraneousNonMatchingPatterns, false);
    });
    describe("returns `false` for non-matching query", () => {
      doHasAllTagsTests(feature, nonMatchingQueries, false);
    });
  });

  describe("on feature with multiple multi-valued tags", () => {
    // prettier-ignore
    const feature = {
      properties: {
        amenity: "parking;cafe",
        // Make sure empty list items and leading/trailing whitespace work
        cuisine: "bakery; ;; sandwich ",
        internet_access: "yes",
        "internet_access:fee": "yes;customers",
      }
    };

    // prettier-ignore
    const preciselyMatchingQueries = toTable([
      "amenity",
      "internet_access:fee",
      ["amenity", "cuisine", "internet_access", "internet_access:fee"],

      { amenity: "parking" },
      { amenity: "cafe" },
      { amenity: ["cafe", "parking"] },
      { cuisine: "bakery" },
      { cuisine: "sandwich" },
      { "internet_access:fee": ["yes", "customers"] },

      ["internet_access", { "internet_access:fee": ["yes", "customers"] }],

      ["amenity", "cuisine", "internet_access", "internet_access:fee", { amenity: ["parking", "cafe"], cuisine: ["bakery", "sandwich"], internet_access: "yes", "internet_access:fee": ["yes", "customers"] }],

      [{ amenity: "parking" }, { amenity: "cafe" }, { cuisine: "bakery" }, { cuisine: "sandwich" }, "amenity", "cuisine", "internet_access", "internet_access:fee", { internet_access: "yes" }, { "internet_access:fee": ["yes", "customers"] }],
    ]);

    // prettier-ignore
    const partiallyMatchingQueriesWithExtraneousNonMatchingPatterns = toTable([
      ["amenity", "name"],
      ["amenity", { amenity: "parking_space" }],
      { "internet_access:fee": ["yes", "no"] },
      [{ "internet_access:fee": ["yes", "customer"] }, "name"],
    ]);

    // prettier-ignore
    const nonMatchingQueries = toTable([
      " cuisine ",
      { cuisine: " " },
      { cuisine: "" },
      { cuisine: " sandwich " },
    ]);

    describe("returns `true` for precisely matching query", () => {
      doHasAllTagsTests(feature, preciselyMatchingQueries, true);
    });
    describe("returns `false` for partially matching query with extraneous non-matching patterns", () => {
      // prettier-ignore
      doHasAllTagsTests(feature, partiallyMatchingQueriesWithExtraneousNonMatchingPatterns, false);
    });
    describe("returns `false` for non-matching query", () => {
      doHasAllTagsTests(feature, nonMatchingQueries, false);
    });
  });
});

/**
 * @param {Feature} feature
 * @param {JestTable} queries
 * @param {boolean} expectedResult
 */
function doHasAnyTagsTests(feature, queries, expectedResult) {
  if (queries.length === 0) {
    return;
  }

  test.each(queries)(
    tableTestName,
    (query) => {
      expect(Features.hasAnyTags(feature, query)).toBe(expectedResult);
    },
    testTimeoutMs
  );
}

/**
 * @param {Feature} feature
 * @param {JestTable} queries
 * @param {boolean} expectedResult
 */
function doHasAllTagsTests(feature, queries, expectedResult) {
  if (queries.length === 0) {
    return;
  }

  test.each(queries)(
    tableTestName,
    (query) => {
      expect(Features.hasAllTags(feature, query)).toBe(expectedResult);
    },
    testTimeoutMs
  );
}
