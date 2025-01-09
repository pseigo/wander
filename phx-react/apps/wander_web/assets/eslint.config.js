import globals from "globals";
//import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  {
    files: ["wander/**/*.{js,jsx,ts,tsx}"],
    ignores: [],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2017,
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
      "react/prop-types": "warn",
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
  }
];
