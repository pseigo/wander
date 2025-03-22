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

// TODO: unit test `clamp`

/**
 * Returns `num` bounded to `[min, max]`.
 *
 * - If `num` is less than `min`, returns `min`.
 * - If `num` is greater than `max`, returns `max`.
 * - Otherwise, returns `num`.
 *
 * @param {number} num - The number to bound.
 * @param {number} min - The lower bound.
 * @param {number} max - The upper bound.
 *
 * @returns {number}
 */
export function clamp(num, min, max) {
  return Math.max(
    min,
    Math.min(
      num,
      max
    )
  );
}
