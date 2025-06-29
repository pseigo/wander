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

import { wrap } from "tanaris/arrays";
import { isPlainObject } from "tanaris/objects";
import { isString } from "tanaris/strings";

/**
 * @typedef {(
 *   string |
 *   Object.<string, string | string[]> |
 *   Array.<string | Object.<string, string | string[]>>
 * )} FeatureTagsMatchExpression
 *
 * @example `"shop"`
 * @example `["shop", "indoor_seating"]`
 * @example `{shop: "coffee_shop"}`
 * @example `[{shop: "coffee_shop"}, {amenity: "cafe"}, {cuisine: ["bakery", "sandwich"]}]`
 * @example `{shop: "coffee_shop", amenity: "cafe", cuisine: ["bakery", "sandwich"]}`
 * @example `["shop", {amenity: "cafe", cuisine: ["bakery", "sandwich"]}]`
 */

// istanbul ignore next
/**
 * @param {Feature} feature
 *
 * @returns {boolean}
 */
export function isWheelchairAccessible(feature) {
  return hasAllTags(feature, { wheelchair: "yes" });
}

// istanbul ignore next
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

// istanbul ignore next
/**
 * @param {Feature} feature
 *
 * @returns {boolean}
 */
export function hasBabyChangingStation(feature) {
  return hasAllTags(feature, { changing_table: "yes" });
}

// istanbul ignore next
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

// istanbul ignore next
/**
 * @param {Feature} feature
 *
 * @returns {boolean}
 */
export function hasIndoorSeating(feature) {
  return hasAnyTags(feature, { indoor_seating: ["yes", "bar_table"] });
}

// istanbul ignore next
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

// istanbul ignore next
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

// istanbul ignore next
/**
 * @param {Feature} feature
 *
 * @returns {boolean}
 */
export function hasInternetAccess(feature) {
  return hasAnyTags(feature, { internet_access: ["yes", "wlan"] });
}

/**
 * Returns an object containing the `feature`'s tags, excluding meta-tags (keys
 * starting with "@").
 *
 * @param {Feature] feature
 *
 * @returns {{string: string}}
 */
export function getTags(feature) {
  return Object.fromEntries(
    Object.entries(feature.properties).filter(
      ([key, _]) => !key.startsWith("@")
    )
  );
}

// TODO: Determine what `hasAnyTags` and `hasAllTags` should return for empty
//  queries if a time comes where I do want to have empty queries, so I have a
//  real use case to base the design off of.

/**
 * Returns `true` iff `feature` has _at least one_ of the tags in the
 * `matchExpr`.
 *
 * If one of the `matchExpr` elements is an object, that element will only
 * match if (a) the feature has the tag, _and_ (b) the tag has _at least one_
 * of the values listed; if the feature has that tag, but none of the values
 * listed, that will not be a match. For example,
 * `{toilets: ["yes", "customers"]}` will match iff the feature has the tag
 * "toilets=yes" or "toilets=customers" or "toilets=...;yes;..." or
 * "toilets=...;customers;..." or "toilets=...;yes;...;customers;...".
 *
 * Note: This function _does_ understand OSM's "yes;customers" value
 * lists for tags in the `feature`, but it _does NOT_ attempt to understand
 * values in the `matchExpr` like "yes;customers" as a list. You need to
 * provide JavaScript lists in your `matchExpr` instead, like
 * `["yes", "customers"]`.
 *
 * ## Time complexity
 *
 * `O(n * m)` such that:
 *
 * - `n` is `feature.properties.length` plus the number of tag values.
 *   (e.g., the value "yes" contributes 1 to `n`, "yes;customers" contributes 2.)
 *
 * - `m` is the number of bare keys plus the number of key-value pairs in the
 *   `matchExpr`.
 *   (e.g., `["cuisine", {amenity: ["parking", "cafe"]}]` contributes 3 to `m`.)
 *
 * @param {Feature} feature
 * @param {FeatureTagsMatchExpression} matchExpr
 *
 * @returns {boolean}
 */
export function hasAnyTags(feature, matchExpr) {
  const featureTags = getTags(feature);
  const featureKeys = Object.keys(featureTags);

  const bareKeys = extractBareKeys(matchExpr);

  // Matches if feature has at least one tag matching a bare key.
  if (bareKeys.some((key) => featureKeys.includes(key))) {
    return true;
  }

  const matchObjs = extractMatchObjects(matchExpr);

  // Matches if at least one `matchObj` matches.
  return matchObjs.some((matchObj) => {
    // prettier-ignore
    const tags = Object.entries(matchObj)
      .filter(([key, _]) => featureKeys.includes(key))
      .map(([key, valueOrValues]) => [key, wrap(valueOrValues)]);

    // Matches if at least one value is in the feature's corresponding tag.
    return tags.some(([key, values]) => {
      const featureValuesForKey = osmTagValueStrToList(featureTags[key]);

      return values.some((value) => featureValuesForKey.includes(value));
    });
  });
}

/**
 * Returns `true` iff `feature` has _all_ of the tags listed in the
 * `matchExpr`.
 *
 * If one of the `matchExpr` elements is an object, that element will only
 * match if (a) the feature has the tag, _and_ (b) the tag has _all_ of the
 * values listed; if the feature has that tag, but is _missing_ one or more of
 * the values listed, that will not be a match. For example,
 * `{cuisine: ["bakery", "sandwich"]}` will match iff the feature has the tag
 * "cuisine=bakery;sandwich" or some other list value containing both "bakery"
 * _and_ "sandwich", such as "cuisine=...;sandwich;...;bakery;...".
 *
 * Note: This function _does_ understand OSM's "bakery;sandwich" value
 * lists for tags in the `feature`, but it _does NOT_ attempt to understand
 * values in the `matchExpr` like "bakery;sandwich" as a list. You need to
 * provide JavaScript lists in your `matchExpr` instead, like
 * `["bakery", "sandwich"]`.
 *
 * ## Time complexity
 *
 * `O(n * m)` such that:
 *
 * - `n` is `feature.properties.length` plus the number of tag values.
 *   (e.g., the value "yes" contributes 1 to `n`, "yes;customers" contributes 2.)
 *
 * - `m` is the number of bare keys plus the number of key-value pairs in the
 *   `matchExpr`.
 *   (e.g., `["cuisine", {amenity: ["parking", "cafe"]}]` contributes 3 to `m`.)
 *
 * @param {Feature} feature
 * @param {FeatureTagsMatchExpression} matchExpr
 *
 * @returns {boolean}
 */
export function hasAllTags(feature, matchExpr) {
  const featureTags = getTags(feature);
  const featureKeys = Object.keys(featureTags);

  const bareKeys = extractBareKeys(matchExpr);

  // Feature must have a tag for every bare key.
  if (!bareKeys.every((key) => featureKeys.includes(key))) {
    return false;
  }

  const matchObjs = extractMatchObjects(matchExpr);

  // Every `matchObj` must match.
  return matchObjs.every((matchObj) => {
    // prettier-ignore
    const tags = Object.entries(matchObj)
      .map(([key, valueOrValues]) => [key, wrap(valueOrValues)]);

    // Every value must be in the feature's corresponding tag.
    return tags.every(([key, values]) => {
      const featureValuesForKey = Object.hasOwn(featureTags, key)
        ? osmTagValueStrToList(featureTags[key])
        : [];

      return values.every((value) => featureValuesForKey.includes(value));
    });
  });
}

/**
 * @param {FeatureTagsMatchExpression} matchExpr
 *
 * @returns {string[]}
 */
function extractBareKeys(matchExpr) {
  const isBareKey = (value) => isString(value);

  if (isBareKey(matchExpr)) {
    return [matchExpr];
  }

  if (Array.isArray(matchExpr)) {
    return matchExpr.filter((e) => isBareKey(e));
  }

  return [];
}

/**
 * @param {FeatureTagsMatchExpression} matchExpr
 *
 * @returns {object[]}
 */
function extractMatchObjects(matchExpr) {
  const isMatchObject = (value) => isPlainObject(value);

  if (isMatchObject(matchExpr)) {
    return [matchExpr];
  }

  if (Array.isArray(matchExpr)) {
    return matchExpr.filter((e) => isMatchObject(e));
  }

  return [];
}

/**
 * Splits a string like "bakery" or "bakery;sandwich" into a list like
 * `["bakery"]` or `["bakery", "sandwich"]` according to the `delimiter`.
 *
 * The resulting values also have any leading and trailing whitespace removed,
 * and empty elements are filtered out.
 *
 * @param {string} str - An OSM tag value like "bakery" or "bakery;sandwich".
 * @param {string} delimiter - Defaults to ";".
 *
 * @return {string[]}
 */
function osmTagValueStrToList(str, delimiter = ";") {
  return str
    .split(delimiter)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
