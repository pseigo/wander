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

import { intersperse } from "/wander/common/arrays";
import { Disclosure } from "/wander/common/components/disclosure";

import { ConciseOpeningHours } from "../concise_opening_hours";
import { IconWithContent, RowIcon } from "./icon_with_content";
import { Row } from "./row";

/**
 * @param {object} props
 * @param {WeekdayWithTimeRangeStrs[]} props.openingHoursStrs
 */
export function OpeningHoursRow({ feature, openingHoursStrs }) {
  return (
    <Row>
      <Disclosure isInitiallyExpanded={false}>
        {(isExpanded) => (
          <IconWithContent
            icon={<RowIcon name="schedule" />}
            content={
              !isExpanded ? (
                <ConciseOpeningHours feature={feature} compact={true} />
              ) : (
                <DetailedOpeningHours
                  feature={feature}
                  openingHoursStrs={openingHoursStrs}
                />
              )
            }
            flexAlignClasses={isExpanded ? "items-start" : undefined}
          />
        )}
      </Disclosure>
    </Row>
  );
}

const DetailedOpeningHours = memo(function DetailedOpeningHours({ feature, openingHoursStrs }) {
  return (
    <div
      className={clsx([
        "flex flex-col gap-[9px]",
        "text-[.938rem] leading-[.938rem]",
      ])}
    >
      <ConciseOpeningHours feature={feature} compact={true} />

      <div
        className={clsx([
          "grid grid-cols-[repeat(2,max-content)] gap-x-[17px] gap-y-[.313rem]",
        ])}
      >
        {openingHoursStrs.map((ohs, index) => (
          <DetailedOpeningHoursRow
            key={index}
            isToday={index === 0}
            weekdayWithTimeRangeStrs={ohs}
          />
        ))}
      </div>
    </div>
  );
});

/**
 * @param {WeekdayWithTimeRangeStrs} weekdayWithTimeRangeStrs
 * @param {boolean} isToday - Whether to style the row with emphasis to show
 *  that it corresponds to today. Defaults to `false`.
 */
const DetailedOpeningHoursRow = memo(function DetailedOpeningHoursRow({
  isToday = false,
  weekdayWithTimeRangeStrs,
}) {
  const { weekday, shortWeekday, timeRanges } = weekdayWithTimeRangeStrs;

  const isClosedAllDay = timeRanges.length === 0;

  const concatenatedTimeRanges = !isClosedAllDay
    ? intersperse(timeRanges, ", ").reduce((acc, e) => acc + e, "")
    : "Closed";

  const weekdayClasses = clsx([
    isToday && "font-semibold",
    isClosedAllDay && "text-[#7d7d7d]",
  ]);

  const timeRangesClasses = clsx([
    isToday && "font-semibold",
    isClosedAllDay && "text-[#7d7d7d] italic",
  ]);

  const timeRangesAriaLabel = `Times this place is open ${(isToday && "today") || "on " + weekday}`;

  return (
    <>
      <span aria-label={weekday} className={weekdayClasses}>
        {shortWeekday}
      </span>
      <span aria-label={timeRangesAriaLabel} className={timeRangesClasses}>
        {concatenatedTimeRanges}
      </span>
    </>
  );
});
