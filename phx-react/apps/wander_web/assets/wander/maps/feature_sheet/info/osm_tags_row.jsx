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

import { clsx } from "clsx";
import { memo } from "react";

import { Disclosure } from "/wander/common/components/disclosure";
import * as Features from "/wander/maps/osm/features";

import { Row } from "./row";
import { IconWithContent, RowIcon } from "./icon_with_content";

/**
 * @param {Feature} feature
 */
export function OsmTagsRow({ feature }) {
  const tags = Features.getTags(feature);

  return (
    <Row>
      <Disclosure>
        {(isExpanded) => (
          <IconWithContent
            icon={<RowIcon name="atr" />}
            content={
              !isExpanded ? <Header tags={tags} /> : <Details tags={tags} />
            }
            className="grow shrink basis-0"
            flexAlignClasses={isExpanded ? "items-start" : undefined}
          />
        )}
      </Disclosure>
    </Row>
  );
}

const Header = memo(function Header({ tags }) {
  const numTags = tags !== undefined ? Object.keys(tags).length : 0;

  return (
    <span className="text-[.938rem] leading-[.938rem]">Tags ({numTags})</span>
  );
});

const Details = memo(function Details({ tags }) {
  return (
    <div className="flex flex-col gap-[11px] grow shrink basis-0">
      <Header tags={tags} />
      <TagsTable tags={tags} />
    </div>
  );
});

const TagsTable = memo(function TagsTable({ tags }) {
  return (
    <div className="border border-[#e1e1e1] rounded-md overflow-hidden">
      <table className="text-[.813rem] table-fixed w-full">
        <tbody>
          {Object.entries(tags).map(([key, value]) => (
            <TagsTableRow
              key={`${key}=${value}`}
              tagKey={key}
              tagValue={value}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

const TagsTableRow = memo(function TagsTableRow({ tagKey, tagValue }) {
  return (
    <tr
      className={clsx([
        "*:py-[.25rem]",
        "odd:bg-[rgb(250,250,250)] even:bg-[rgb(243,243,243)]",
        "whitespace-normal",
      ])}
      style={{ overflowWrap: "anywhere" }}
    >
      <th
        scope="row"
        className="px-[7px] text-left font-medium w-1/2 border-r border-[#e1e1e1]"
      >
        {tagKey}
      </th>
      <td className="px-[7px] w-1/2">{tagValue}</td>
    </tr>
  );
});
