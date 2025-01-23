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

import { useLocation } from "wouter";

import { InternalLink, ExternalLink } from "/wander/common/components/link";
import {
  useDocumentTitle,
  toDocumentTitle,
} from "/wander/common/hooks/document_title";

export function NotFoundErrorPage() {
  const [location, _navigate] = useLocation();
  const [_documentTitle, _setDocumentTitle] = useDocumentTitle(
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
