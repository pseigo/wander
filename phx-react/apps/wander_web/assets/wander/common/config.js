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

import { isString } from "/wander/common/strings";

import * as nsGlobal from "/wander/config/global.json";
import * as nsDebug from "/wander/config/debug.json";

import { ConfigNamespaceError } from "./config/config_namespace_error";

/**
 * Reads a value from a config file. Returns the value if it exists, or `null`
 * if the key path exists but no value is set, otherwise `undefined` if the key
 * path does not exist in the `namespace`.
 *
 * @param {string} path - Key path to read from. e.g., "map" or "map.tile.type"
 * @param {string} namespace - Name of the config file to load (without extension). Defaults to "global".
 *
 * @returns {(any | null | undefined)}
 *
 * @throws {TypeError} if path is not a `string` or `string[]`.
 * @throws {ConfigNamespaceError} if the namespace does not exist.
 * @throws {SyntaxError} if the namespace's config file cannot be parsed.
 */
export function get(path, namespace = "global") {
  if (!isString(path)) {
    throw new TypeError("`path` arg must be a `string`");
  }

  const config = loadConfig(namespace);
  const pathSegments = path.split(".");
  return getValueFromConfig(config, pathSegments);
}

/**
 * Loads and returns the entire config for `namespace`.
 *
 * @param {string} namespace
 *
 * @returns {object}
 *
 * @throws {ConfigNamespaceError} if the namespace does not exist.
 */
function loadConfig(namespace) {
  switch (namespace) {
    case "global":
      return nsGlobal;

    case "debug":
      return nsDebug;

    default:
      const description = isString(namespace)
        ? `config namespace '${namespace}' does not exist`
        : "`namespace` arg must be a `string`";
      throw new ConfigNamespaceError(description);
  }
}

/**
 * @param {object} config
 * @param {string[]} path
 *
 * @returns {(any | null | undefined)}
 */
function getValueFromConfig(config, path) {
  // Create a new list that we can safely mutate.
  path = [...path];
  path.reverse(); // for `pop`.

  return doGetValueFromConfig(config, path);
}

/**
 * @param {object} currentConfigView
 * @param {string[]} restOfPath
 *
 * @returns {(any | null | undefined)}
 */
function doGetValueFromConfig(currentConfigView, restOfPath) {
  if (restOfPath.length === 0) {
    return currentConfigView;
  }

  const key = restOfPath.pop(); // `restOfPath.length` will inevitably fall to 0.
  const value = currentConfigView[key];

  if (value === undefined || value === null) {
    return value;
  }

  return doGetValueFromConfig(value, restOfPath);
}
