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

/** @type {import("jest").Config} */
const config = {
  testEnvironment: "jsdom",
  moduleDirectories: [
    "node_modules",
    "test",
    //"support"
  ],
  moduleFileExtensions: ["js", "jsx", "cjs", "mjs", "ts", "tsx", "json", "node"],
  extensionsToTreatAsEsm: [".jsx"],
  /*
  moduleNameMapper: {
    "/wander/(.*)": "<rootDir>/wander/$1"
  },
  */
  transform: {
    "\\.[jt]sx?$": "@swc/jest"
  },
  coverageProvider: "babel",
  coverageDirectory: ".coverage"
}

module.exports = config;
