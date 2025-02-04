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

import { wrap } from "/wander/common/arrays";

// TODO: unit test `hasAnyTags` and `hasAllTags`.

/**
 * @typedef {(
 *   string |
 *   Object.<string, string | string[]> |
 *   Array.<string | Object.<string, string | string[]>>
 * )} FeatureTagsMatchList
 *
 * @example `"shop"`
 * @example `["shop", "indoor_seating"]`
 * @example `{shop: "coffee_shop"}`
 * @example `[{shop: "coffee_shop"}, {amenity: "cafe"}, {cuisine: ["bakery", "sandwich"]}]`
 * @example `{shop: "coffee_shop", amenity: "cafe", cuisine: ["bakery", "sandwich"]}`
 * @example `["shop", {amenity: "cafe", cuisine: ["bakery", "sandwich"]}]`
 */

/**
 * @param {Feature} feature
 *
 * @returns {boolean}
 */
export function isWheelchairAccessible(feature) {
  return hasAllTags(feature, { wheelchair: "yes" });
}

/**
 * @param {Feature} feature
 *
 * @returns {boolean}
 */
export function hasToilets(feature) {
  return hasAnyTags(feature, {
    toilets: ["yes", "customers"],
    amenity: "toilets",
  });
}

/**
 * @param {Feature} feature
 *
 * @returns {boolean}
 */
export function hasBabyChangingStation(feature) {
  return hasAllTags(feature, { changing_table: "yes" });
}

/**
 * @param {Feature} feature
 *
 * @returns {boolean}
 */
export function hasOutdoorSeating(feature) {
  return (
    hasAllTags(feature, "outdoor_seating") &&
    !hasAnyTags(feature, { outdoor_seating: ["no", "seasonal"] })
  );
}

/**
 * @param {Feature} feature
 *
 * @returns {boolean}
 */
export function hasIndoorSeating(feature) {
  return hasAnyTags(feature, { indoor_seating: ["yes", "bar_table"] });
}

/**
 * @param {Feature} feature
 *
 * @returns {boolean}
 */
export function hasExclusiveInternetAccess(feature) {
  return (
    hasInternetAccess(feature) &&
    hasAnyTags(feature, { "internet_access:fee": ["yes", "customers"] })
  );
}

/**
 * @param {Feature} feature
 *
 * @returns {boolean}
 */
export function hasPublicInternetAccess(feature) {
  return (
    hasInternetAccess(feature) &&
    !hasAnyTags(feature, { "internet_access:fee": ["yes", "customers"] })
  );
}

/**
 * @param {Feature} feature
 *
 * @returns {boolean}
 */
export function hasInternetAccess(feature) {
  return hasAnyTags(feature, { internet_access: ["yes", "wlan"] });
}

/**
 * Returns `true` iff `feature` has _at least one_ of the tags in the
 * `tagsMatchList`.
 *
 * If one of the `tagsMatchList` elements is an object, that element will only
 * match if (a) the feature has the tag, _and_ (b) the tag has _at least one_
 * of the values listed; if the feature has that tag, but none of the values
 * listed, that will not be a match. For example,
 * `{toilets: ["yes", "customers"]}` will match iff the feature has the tag
 * "toilets=yes" or "toilets=customers" or "toilets=...;yes;..." or
 * "toilets=...;customers;..." or "toilets=...;yes;...;customers;...".
 *
 * Note that this function does not attempt to understand values in the
 * `tagsMatchList` like "yes;customers" as a list. You need to provide a
 * JavaScript list like `["yes", "customers"]` instead.
 *
 * **Time complexity**: `O(n * m)` where `n := feature.properties.length` and
 * `m := tagsMatchList.length`.
 *
 * @param {Feature} feature
 * @param {FeatureTagsMatchList} tagsMatchList
 *
 * @returns {boolean}
 */
export function hasAnyTags(feature, tagsMatchList) {
  const featureTags = feature.properties;
  const featureKeys = Object.keys(featureTags);
  const bareKeys = extractBareKeys(tagsMatchList);
  const matchObjs = extractMatchObjects(tagsMatchList);

  for (const bareKey of bareKeys) {
    if (featureKeys.includes(bareKey)) {
      return true;
    }
  }

  for (const matchObj of matchObjs) {
    for (const [matchObjKey, matchObjValueOrValues] of Object.entries(
      matchObj
    )) {
      if (!featureKeys.includes(matchObjKey)) {
        continue;
      }

      const featureTagValues = splitListStr(featureTags[matchObjKey]);
      const matchObjValues = wrap(matchObjValueOrValues);

      for (const matchObjValue of matchObjValues) {
        if (featureTagValues.includes(matchObjValue)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Returns `true` iff `feature` has _all_ of the tags listed in the
 * `tagsMatchList`.
 *
 * If one of the `tagsMatchList` elements is an object, that element will only
 * match if (a) the feature has the tag, _and_ (b) the tag has _all_ of the
 * values listed; if the feature has that tag, but is _missing_ one or more of
 * the values listed, that will not be a match. For example,
 * `{cuisine: ["bakery", "sandwich"]}` will match iff the feature has the tag
 * "cuisine=bakery;sandwich" or some other list value containing both "bakery"
 * _and_ "sandwich", such as "cuisine=...;sandwich;...;bakery;...".
 *
 * Note that this function does not attempt to understand values in the
 * `tagsMatchList` like "bakery;sandwich" as a list. You need to provide a
 * JavaScript list like `["bakery", "sandwich"]` instead.
 *
 * **Time complexity**: `O(n * m)` where `n := feature.properties.length` and
 * `m := tagsMatchList.length`.
 *
 * @param {Feature} feature
 * @param {FeatureTagsMatchList} tags
 *
 * @returns {boolean}
 */
export function hasAllTags(feature, tagsMatchList) {
  const featureTags = feature.properties;
  const featureKeys = Object.keys(featureTags);
  const bareKeys = extractBareKeys(tagsMatchList);
  const matchObjs = extractMatchObjects(tagsMatchList);

  for (const bareKey of bareKeys) {
    if (!featureKeys.includes(bareKey)) {
      return false;
    }
  }

  for (const matchObj of matchObjs) {
    for (const [matchObjKey, matchObjValueOrValues] of Object.entries(
      matchObj
    )) {
      if (!featureKeys.includes(matchObjKey)) {
        return false;
      }

      const featureTagValues = splitListStr(featureTags[matchObjKey]);
      const matchObjValues = wrap(matchObjValueOrValues);

      for (const matchObjValue of matchObjValues) {
        if (!featureTagValues.includes(matchObjValue)) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * @param {FeatureTagsMatchList} tagsMatchList
 *
 * @returns {string[]}
 */
function extractBareKeys(tagsMatchList) {
  const bareKeys = [];

  if (typeof tagsMatchList === "string") {
    bareKeys.push(tagsMatchList);
  }

  if (
    typeof tagsMatchList === "object" &&
    tagsMatchList.constructor === Array
  ) {
    for (const e of tagsMatchList) {
      if (typeof e === "string") {
        bareKeys.push(e);
      }
    }
  }

  return bareKeys;
}

/**
 * @param {FeatureTagsMatchList} tagsMatchList
 *
 * @returns {object[]}
 */
function extractMatchObjects(tagsMatchList) {
  const matchObjs = [];

  if (
    typeof tagsMatchList === "object" &&
    tagsMatchList.constructor === Object
  ) {
    matchObjs.push(tagsMatchList);
  }

  if (
    typeof tagsMatchList === "object" &&
    tagsMatchList.constructor === Array
  ) {
    for (const e of tagsMatchList) {
      if (typeof e === "object" && e.constructor === Object) {
        matchObjs.push(e);
      }
    }
  }

  return matchObjs;
}

/**
 * Splits a string like "bakery" or "bakery;sandwich" into a list like
 * `["bakery"]` or `["bakery", "sandwich"]` according to the `delimiter`.
 *
 * The resulting values also have leading and trailing whitespace removed.
 *
 * @param {string} listStr
 * @param {string} delimiter - Defaults to ";".
 *
 * @return {string[]}
 */
function splitListStr(listStr, delimiter = ";") {
  let values = listStr.split(delimiter);
  values = values.map((s) => s.trim());
  return values;
}
