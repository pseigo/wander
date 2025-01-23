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

import { useState, useEffect } from "react";

const siteName = "Wander";

/**
 * Hook to set and access the document's title.
 *
 * Both `useDocumentTitle` and its `setDocumentTitle` setter take a string. You
 * can also pass `null` or call `useDocumentTitle()` with no arguments to use
 * the site's default title.
 *
 * ## Creating consistent titles with `toDocumentTitle`
 *
 * If you would like the title to include the site name (probably in most
 * cases), or would like the title to describe more than one section in a way
 * that's consistent across the application, use `toDocumentTitle` to create
 * the value you pass into `setDocumentTitle`. See the documentation for
 * `toDocumentTitle` to learn more.
 *
 * @example &lt;caption>Setting the document title on mount.&lt;/caption>
 * import {
 *   useDocumentTitle,
 *   toDocumentTitle
 * } from "/wander/common/hooks/document_title";
 *
 * export function ExamplePage() {
 *   const [documentTitle, setDocumentTitle] = useDocumentTitle(
 *     toDocumentTitle(
 *       ["Sub-section", "Initial Title"]
 *     )
 *   );
 *
 *   return (
 *     <main>
 *       <h1>Example Page</h1>
 *       <p>
 *          The current document title is:{" "}
 *          <code>{documentTitle}</code>
 *       </p>
 *       <button onClick={() => setDocumentTitle("New Title")}>
 *          Change Document Title
 *       </button>
 *    </main>
 *  );
 * }
 *
 * @returns {[string, React.Dispatch<React.SetStateAction<string | null>>]} `[documentTitle, setDocumentTitle]`
 */
export function useDocumentTitle(initialTitle = null) {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (title === null || title === undefined) {
      setTitle(defaultTitle());
      return destructor;
    }

    document.title = title;
    return destructor;
  }, [title]);

  return [title, setTitle];
}

function destructor() {
  // Set default on unmount in case the next route doesn't set a title.
  document.title = defaultTitle();
}

/**
 * @returns {string}
 */
function defaultTitle() {
  return siteName ?? "";
}

/**
 * Creates a document title string with the site name (optionally) appended to
 * the end.
 *
 * It is recommended to always use this function for document titles across the
 * website/app. The only time you would _not_ use this function is if you want
 * to set a completely custom document title (e.g., on the main landing page).
 *
 * The result of this function is typically passed into the hook
 * `useDocumentTitle` or the `setDocumentTitle` setter it returns.
 *
 * @param {(string | string[])} titleOrTitles
 * @param {object} opts
 * @param {boolean} opts.withSiteName - Iff `true`, appends site name to end of document title. Defaults to `true`.
 *
 * @returns {string}
 */
export function toDocumentTitle(titleOrTitles, opts = { withSiteName: true }) {
  const { withSiteName } = opts;
  const titles = normalizeTitleOrTitles(titleOrTitles, withSiteName);
  const title = titles.reduceRight((acc, e) => e + " | " + acc);
  return title;
}

/**
 * @param {(string | string[]} titleOrTitles
 * @param {boolean} withSiteName
 *
 * @returns {string[]}
 */
function normalizeTitleOrTitles(titleOrTitles, withSiteName) {
  const errorPrefix =
    "[toTitle/1][normalizeTitleOrTitles/2]: 'titleOrTitles' argument must be an 'Array' or 'String', but";

  const type = typeof titleOrTitles;
  switch (type) {
    case "string":
    case "object":
      break;

    default:
      const error = `${errorPrefix} 'typeof titleOrTitles' is '${type}'`;
      throw new Error(error);
  }

  /** @type {string[]} */
  let titles = [];

  const constructor = titleOrTitles.constructor;
  switch (constructor) {
    case String:
      titles = [titleOrTitles];
      break;

    case Array:
      titles = titleOrTitles;
      break;

    default:
      const error = `${errorPrefix} 'titleOrTitles.constructor' is '${constructor}'`;
      throw new Error(error);
  }

  if (withSiteName) {
    return [...titles, siteName];
  } else {
    return titles;
  }
}
