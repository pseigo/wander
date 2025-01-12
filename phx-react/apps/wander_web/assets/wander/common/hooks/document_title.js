import { useState, useEffect } from "react";

const siteName = "Wander";

/**
 * Hook to access and set the document's title. You must call
 * `setDocumentTitle` yourself on mount.
 *
 * `setDocumentTitle` takes a string, or `null` to use the site's default
 * title.
 *
 * ## Reducing boilerplate
 *
 * If you're not using `setDocumentTitle` beyond the initial mount, you can
 * reduce boilerplate by using `useStaticDocumentTitle` instead.
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
 * import { useDynamicDocumentTitle, toDocumentTitle } from "/wander/common/hooks/document_title";
 *
 * export function ExamplePage() {
 *   const [_documentTitle, setDocumentTitle] = useDynamicDocumentTitle();
 *
 *   useEffect(() => {
 *     setDocumentTitle(toDocumentTitle(["Sub-section", "Example"]));
 *   }, []);
 *
 *   return <main><h1>Example Page</h1></main>
 * }
 *
 * @returns {[string, React.Dispatch<React.SetStateAction<string>>]} `[documentTitle, setDocumentTitle]`
 */
export function useDynamicDocumentTitle() {
  const [title, setTitle] = useState(null);

  useEffect(() => {
    if (title === null || title === undefined) {
      const newTitle = siteName ?? "";
      setTitle(newTitle);
      return destructor;
    }

    document.title = title;
    return destructor;
  }, [title]);

  return [title, setTitle];
}

/**
 * Hook to access the document title and set it on mount.
 *
 * ## Changing the document title after the initial mount
 *
 * If you would like to change the document's title after the initial mount,
 * you can use `useDynamicDocumentTitle` instead.
 *
 * ## Creating consistent titles with `toDocumentTitle`
 *
 * If you would like the title to include the site name (probably in most
 * cases), or would like the title to describe more than one section in a way
 * that's consistent across the application, use `toDocumentTitle` to create
 * the value you pass into `useStaticDocumentTitle`. See the documentation for
 * `toDocumentTitle` to learn more.
 *
 * @example &lt;caption>Setting the document title on mount.&lt;/caption>
 * import { useStaticDocumentTitle, toDocumentTitle } from "/wander/common/hooks/document_title";
 *
 * export function ExamplePage() {
 *   const [_documentTitle] = useStaticDocumentTitle(toDocumentTitle(["Sub-section", "Example"]));
 *
 *   return <main><h1>Example Page</h1></main>
 * }
 *
 * @param {(string | null)} title - The document title, or `null` to use the site's default title.
 *
 * @returns {[string]}
 */
export function useStaticDocumentTitle(title) {
  // Declare outside `useEffect` so we can return it to the call site, because
  // we're not using `useState`.
  const titleOrSiteName = (title !== null) ? title : siteName;

  useEffect(() => {
    document.title = titleOrSiteName;
    return destructor;
  }, []);

  return [titleOrSiteName];
}

function destructor() {
  // In case some routes don't set a title.
  document.title = siteName ?? "";
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
 * `useStaticDocumentTitle`, or `setDocumentTitle` returned by the hook
 * `useDynamicDocumentTitle`.
 *
 * @param {(string | string[])} titleOrTitles
 * @param {object} opts
 * @param {boolean} opts.withSiteName - Iff `true`, appends site name to end of document title. Defaults to `true`.
 *
 * @returns {string}
 */
export function toDocumentTitle(titleOrTitles, opts = {withSiteName: true}) {
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
  /** @type {string[]} */
  let titles = [];
  const type = titleOrTitles.constructor;

  switch (type) {
    case String:
      titles = [titleOrTitles];
      break;

    case Array:
      titles = titleOrTitles;
      break;

    default:
      const error = `[toTitle/1][normalizeTitleOrTitles/2]: 'titleOrTitles' argument must be an 'Array' or 'String', but 'titleOrTitles.constructor' is '${type}'`;
      throw new Error(error);
  }

  if (withSiteName) {
    return [...titles, siteName];
  } else {
    return titles;
  }
}
