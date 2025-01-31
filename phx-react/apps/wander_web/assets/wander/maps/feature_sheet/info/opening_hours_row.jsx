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
import { useMemo } from "react";

import { Disclosure } from "/wander/common/components/disclosure";

import { IconWithContent, RowIcon } from "./icon_with_content";
import { Row } from "./row";

export function OpeningHoursRow() {
  return (
    <Row>
      <Disclosure isInitiallyExpanded={false}>
        {(isExpanded) => (
          <IconWithContent
            icon={<RowIcon name="schedule" />}
            content={
              !isExpanded ? <ConciseOpeningHours /> : <DetailedOpeningHours />
            }
            flexAlignClasses={isExpanded ? "items-start" : undefined}
          />
        )}
      </Disclosure>
    </Row>
  );
}

// [start] Row-specific stuff
function ConciseOpeningHours({ feature }) {
  return (
    <div
      className={clsx([
        "flex flex-row gap-[5px]",
        "text-[.938rem] leading-[.938rem]",
      ])}
    >
      <span className={clsx(["font-semibold text-[#479768]"])}>Open</span>
      <span aria-hidden="true">·</span>
      <div className="flex flex-row gap-1 items-baseline">
        <span>Closes 6pm</span>
        <span className="text-[#8a8a8a] text-[.813rem]">(2h30m)</span>
      </div>
    </div>
  );
}

function DetailedOpeningHours({ feature }) {
  return (
    <div
      className={clsx([
        "flex flex-col gap-[9px]",
        "text-[.938rem] leading-[.938rem]",
      ])}
    >
      <div className={clsx(["flex flex-row gap-[.36rem] items-baseline"])}>
        <span className={clsx(["text-normal font-semibold text-[#479768]"])}>
          Open
        </span>
        <span className="text-[#8a8a8a]">(Closes in 2h30m)</span>
      </div>

      <div
        className={clsx([
          "grid grid-cols-[repeat(2,max-content)] gap-x-[17px] gap-y-[.313rem]",
        ])}
      >
        <span className="font-semibold">Tue</span>
        <span className="font-semibold">7:30am – 6:00pm</span>

        <span>Wed</span>
        <span>7:30am – 6:00pm</span>

        <span>Thu</span>
        <span>7:30am – 6:00pm</span>

        <span>Fri</span>
        <span>7:30am – 6:00pm</span>

        <span className="text-[#7d7d7d]">Sat</span>
        <span className="text-[#7d7d7d] italic">Closed</span>

        <span className="text-[#7d7d7d]">Sun</span>
        <span className="text-[#7d7d7d] italic">Closed</span>

        <span>Mon</span>
        <span>7:30am – 6:00pm</span>
      </div>
    </div>
  );
}
