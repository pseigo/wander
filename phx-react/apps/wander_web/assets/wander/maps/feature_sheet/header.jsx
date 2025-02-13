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

import * as Features from "/wander/maps/osm/features";

import { ConciseOpeningHours } from "./concise_opening_hours";
import { Actions } from "./header/actions";
import { AmenityIcon } from "./header/amenity_icon";

export function Header({
  feature,
  onClose,
  titleShrinkProgress,
  currentDetent,
  ref,
}) {
  return (
    <div data-testid="feature-sheet__header" ref={ref}>
      <Actions onClose={onClose} />
      <div className="flex flex-col gap-0">
        <Title feature={feature} titleShrinkProgress={titleShrinkProgress} />
        <ConciseInfo feature={feature} />
        {feature.properties.opening_hours !== undefined &&
          currentDetent === "small" && (
            <ConciseOpeningHours feature={feature} className="mt-[.2rem]" />
          )}
      </div>
    </div>
  );
}

/**
 * @param {Feature} feature
 * @param {float} titleShrinkProgress in `[0, 1.0]`
 */
const Title = memo(function Title({ feature, titleShrinkProgress }) {
  const name = feature.properties.name ?? (
    <span className="italic">(name unknown)</span>
  );

  // titleShrinkProgress == 0 => 24px == 1.25rem;
  // titleShrinkProgress == 1 => 20px == 1.5rem;
  //const fontSize = `calc(1.5rem - .25rem * ${titleShrinkProgress})`;

  return (
    <h2
      className={clsx([
        "font-bold",
        "text-[1.25rem]",

        // TODO: only clip if detent is small
        "whitespace-nowrap overflow-hidden text-ellipsis",
      ])}
      //style={{
      //  fontSize: fontSize,
      //}}
    >
      {name}
    </h2>
  );
});

const ConciseInfo = memo(function ConciseInfo({ feature }) {
  const amenityIcons = [
    Features.isWheelchairAccessible(feature) && (
      <AmenityIcon key="accessible_forward" name="accessible_forward" />
    ),
    Features.hasIndoorSeating(feature) && (
      <AmenityIcon key="table_bar" name="table_bar" />
    ),
    Features.hasOutdoorSeating(feature) && (
      <AmenityIcon key="deck" name="deck" />
    ),
    Features.hasExclusiveInternetAccess(feature) ? (
      <AmenityIcon key="wifi_lock" name="wifi_lock" />
    ) : (
      Features.hasPublicInternetAccess(feature) && (
        <AmenityIcon key="wifi" name="wifi" />
      )
    ),
    Features.hasToilets(feature) && <AmenityIcon key="wc" name="wc" />,
    Features.hasBabyChangingStation(feature) && (
      <AmenityIcon key="baby_changing_station" name="baby_changing_station" />
    ),
  ];

  const hasAmenityIcons = amenityIcons.some((e) => e !== false);

  return (
    <div
      className={clsx([
        "mb-[-1px]",
        "flex flex-row gap-[5px] items-baseline",
        "text-[.875rem]",
      ])}
    >
      <span>Coffee Shop</span>
      {!!hasAmenityIcons && (
        <>
          <span aria-hidden="true">·</span>
          <div className="flex flex-row gap-[.12rem] items-baseline relative">
            {amenityIcons.map((e) => e)}
          </div>
        </>
      )}
    </div>
  );
});
