/*
 * Copyright (c) 2025 Peyton Seigo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { clsx } from "clsx";

import { Icon } from "/wander/common/components/icon";

import { Actions } from "./header/actions";
import { AmenityIcon } from "./header/amenity_icon";

export function Header({ feature, onClose, titleShrinkProgress }) {
  return (
    <div>
      <Actions onClose={onClose} />
      <div className="flex flex-col gap-0">
        <Title feature={feature} titleShrinkProgress={titleShrinkProgress} />
        <ConciseInfo feature={feature} />
        <ConciseStatus feature={feature} />
      </div>
    </div>
  );
}

/**
 * @param {Feature} feature
 * @param {float} titleShrinkProgress in `[0, 1.0]`
 */
function Title({ feature, titleShrinkProgress }) {
  const name = feature.properties.name ?? (
    <span className="italic">(name unknown)</span>
  );

  // titleShrinkProgress == 0 => 24px == 1.25rem;
  // titleShrinkProgress == 1 => 20px == 1.5rem;
  const fontSize = `calc(1.5rem - .25rem * ${titleShrinkProgress})`;

  return (
    <h2
      className={clsx([
        "font-bold",

        // TODO: only clip if detent is small
        "whitespace-nowrap overflow-hidden text-ellipsis",
      ])}
      style={{
        fontSize: fontSize,
      }}
    >
      {name}
    </h2>
  );
}

function ConciseInfo({ feature }) {
  return (
    <div
      className={clsx([
        "mb-[-1px]",
        "flex flex-row gap-[5px] items-baseline",
        "text-[.875rem]",
      ])}
    >
      <span>Coffee Shop</span>
      <span aria-hidden="true">·</span>
      <div className="flex flex-row gap-1.5 items-baseline">
        <AmenityIcon name="hero-wifi-micro" />
        {/* TODO: Get Material icons or another set to support more amenity icons. */}
      </div>
    </div>
  );
}

function ConciseStatus({ feature }) {
  return (
    <div className={clsx(["flex flex-row gap-[5px]", "text-[1rem]"])}>
      <span className={clsx(["font-semibold text-[#01a001]"])}>Open</span>

      <span aria-hidden="true">·</span>

      <div className="flex flex-row gap-1 items-baseline">
        <span>Closes 6pm</span>
        <span className="text-[#8a8a8a] text-[.813rem]">(2h30m)</span>
      </div>
    </div>
  );
}
