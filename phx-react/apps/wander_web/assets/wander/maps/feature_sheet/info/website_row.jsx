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

import { useMemo } from "react";

import { ExternalLink } from "/wander/common/components/link";

import { IconWithContent, RowIcon } from "./icon_with_content";
import { Row } from "./row";

export function WebsiteRow({ website }) {
  const normalizedWebsite = useMemo(() => normalizeUrl(website), [website]);

  const conciseWebsite = useMemo(
    () => websiteToConciseString(normalizedWebsite),
    [normalizedWebsite]
  );

  return (
    <Row>
      <IconWithContent
        icon={<RowIcon name="link" />}
        content={
          <ExternalLink
            href={normalizedWebsite}
            className="text-[.938rem] leading-[.938rem]"
          >
            {conciseWebsite}
          </ExternalLink>
        }
      />
    </Row>
  );
}

function normalizeUrl(url) {
  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    url = `https://${url}`;
  }

  url = new URL(url).toString();
  return url;
}

function websiteToConciseString(website) {
  // prettier-ignore
  if (website.startsWith("http://"))
  {
    website = website.slice("http://".length);
  }
  else if (website.startsWith("https://"))
  {
    website = website.slice("https://".length);
  }

  if (website.startsWith("www.")) {
    website = website.slice("www.".length);
  }

  if (website.endsWith("/")) {
    website = website.substring(0, website.length - 1);
  }

  return website;
}
