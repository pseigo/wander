import { useLocation } from "wouter";

import { InternalLink, ExternalLink } from "/wander/common/components/link";
import {
  useStaticDocumentTitle,
  toDocumentTitle,
} from "/wander/common/hooks/document_title";

export function NotFoundErrorPage() {
  const [location, _navigate] = useLocation();
  const [_documentTitle] = useStaticDocumentTitle(
    toDocumentTitle(["Not Found", "Error"])
  );

  return (
    <div className="px-touch/2 pt-10">
      <div className="max-w-[600px] mx-[auto]">
        <h1 className="text-3xl mb-4">Not Found (404)</h1>
        <p className="mb-4">
          Sorry, something went wrong. This page is either missing or doesn't
          exist.
        </p>
        <p className="indent-4 mb-12">
          <code>{location}</code>
        </p>

        <h2 className="text-2xl mt-8 mb-2">What now?</h2>
        <p className="mb-2">Some things you can try:</p>

        <ul className="list-disc list-inside space-y-2">
          <li>Check the URL for typos and try again</li>
          <li>
            <ExternalLink href="https://github.com/pseigo/wander/issues/new">
              Report a bug
            </ExternalLink>{" "}
            if one or more links on this site led you here
          </li>
          <li className="font-semibold">
            <InternalLink href="/">Go back to the home page</InternalLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
