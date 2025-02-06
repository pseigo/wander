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
 * Returns `true` iff `value` is a plain object.
 *
 * A "plain object" is considered to be an object literal like `{a: 1, b: 2}`
 * or an object created with `Object.create`.
 *
 * @param {any} value
 *
 * @returns {boolean}
 */
export function isPlainObject(value) {
  return (
    value !== undefined &&
    value !== null &&
    typeof value === "object" &&
    value.constructor === Object
  );
}
