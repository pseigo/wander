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

import { ExternalLink } from "/wander/common/components/link";
import { capitalize } from "/wander/common/strings";

import { Row } from "./row";
import { IconWithContent, RowIcon } from "./icon_with_content";

/**
 * @param {Feature} feature
 */
export function OsmIdRow({ feature }) {
  const osmId = feature.properties["@id"];
  const osmType = feature.properties["@type"];
  const osmUrl = `https://www.openstreetmap.org/${osmType}/${osmId}`;

  return (
    <Row>
      <IconWithContent
        icon={<RowIcon name="circle" />}
        content={
          <ExternalLink
            href={osmUrl}
            className="text-[.938rem] leading-[.938rem]"
          >
            {capitalize(osmType)}/{osmId}
          </ExternalLink>
        }
      />
    </Row>
  );
}
