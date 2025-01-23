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

import globals from "globals";
//import js from "@eslint/js";
import react from "eslint-plugin-react";
import jest from "eslint-plugin-jest";

export default [
  {
    name: "wander",
    files: [
      "*.config.{js,cjs}",
      "wander/**/*.{js,jsx,ts,tsx}"
    ],
    ignores: [],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2020,
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
          jsx: true
        }
      },
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      react
    },
    settings: {
      react: {
        version: "19"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-undef": "warn",

      // [start] React
      // - see: https://github.com/jsx-eslint/eslint-plugin-react/blob/master/README.md#list-of-supported-rules
      // Recommended:
      "react/display-name": "warn",
      "react/jsx-key": "warn",
      "react/jsx-no-comment-textnodes": "warn",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-target-blank": "error",
      "react/jsx-no-undef": "warn",
      "react/jsx-uses-react": "warn",
      "react/jsx-uses-vars": "warn",
      "react/no-children-prop": "warn",
      "react/no-danger-with-children": "warn",
      "react/no-direct-mutation-state": "warn",
      "react/no-find-dom-node": "warn",
      "react/no-is-mounted": "warn",
      "react/no-render-return-value": "warn",
      "react/no-string-refs": "warn",
      "react/no-unescaped-entities": "warn",
      "react/no-unknown-property": "warn",
      "react/require-render-return": "error",
      // Our rules:
      "react/jsx-no-leaked-render": "error",
      "react/jsx-no-useless-fragment": "warn",
      "react/no-access-state-in-setstate": "error",
      "react/no-array-index-key": "warn",
      "react/no-arrow-function-lifecycle": "warn",
      "react/no-danger": "warn",
      "react/no-deprecated": "warn",
      "react/no-did-mount-set-state": "warn",
      "react/no-did-update-set-state": "warn",
      "react/no-will-update-set-state": "warn",
      "react/no-invalid-html-attribute": "warn",
      "react/no-redundant-should-component-update": "warn",
      "react/no-this-in-sfc": "warn",
      "react/no-typos": "warn",
      "react/no-unsafe": "warn",
      "react/no-unstable-nested-components": "warn",
      "react/void-dom-elements-no-children": "error"
      // [end] React
    }
  },
  {
    name: "wander-test",
    files: [
      "test/**/*.{js,jsx,ts,tsx}"
    ],
    ignores: [],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2020,
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
          jsx: true
        }
      },
      globals: {
        ...globals.jest
      }
    },
    plugins: {
      jest
    },
    settings: {},
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-undef": "warn",

      // [start] Jest
      // - see: https://github.com/jest-community/eslint-plugin-jest/blob/main/README.md#rules
      // Recommended:
      "jest/expect-expect": "warn",
      "jest/no-alias-methods": "warn",
      "jest/no-conditional-expect": "warn",
      "jest/no-deprecated-functions": "warn",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "warn",
      "jest/no-test-prefixes": "error",
      "jest/no-done-callback": "error",
      "jest/no-export": "error",
      "jest/no-identical-title": "error",
      "jest/no-interpolation-in-snapshots": "error",
      "jest/no-jasmine-globals": "error",
      "jest/no-mocks-import": "error",
      "jest/no-standalone-expect": "error",
      "jest/prefer-to-be": "warn",
      "jest/prefer-to-contain": "warn",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-describe-callback": "error",
      "jest/valid-title": "error",
      "jest/valid-expect": "error",
      "jest/valid-expect-in-promise": "error",
      // Our rules:
      "jest/no-confusing-set-timeout": "warn",
      "jest/no-duplicate-hooks": "warn",
      "jest/no-test-return-statement": "error",
      "jest/prefer-called-with": "warn",
      "jest/prefer-comparison-matcher": "warn",
      "jest/prefer-each": "warn",
      "jest/prefer-equality-matcher": "warn",
      "jest/prefer-expect-resolves": "warn",
      "jest/prefer-mock-promise-shorthand": "warn",
      "jest/prefer-strict-equal": "warn",
      "jest/prefer-todo": "warn"
      // [end] Jest
    }
  }
];
