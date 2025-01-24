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
import { useCallback, useState } from "react";

import { MaterialIcon } from "/wander/common/components/icon";
import { ExternalLink } from "/wander/common/components/link";

export function Info({ feature }) {
  return (
    <div className={clsx(["w-full"])}>
      <Rows />
    </div>
  );
}

function Rows() {
  return (
    <div className={clsx(["flex flex-col gap-0", "divide-y border-[#e1e1e1]"])}>
      <Row>
        <Disclosure isInitiallyExpanded={true}>
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

      <Row>
        <Disclosure isInitiallyExpanded={false}>
          {(isExpanded) => (
            <IconWithContent
              icon={<RowIcon name="pin_drop" />}
              content={!isExpanded ? <ConciseAddress /> : <DetailedAddress />}
              flexAlignClasses={isExpanded ? "items-start" : undefined}
            />
          )}
        </Disclosure>
      </Row>

      <Row>
        <IconWithContent
          icon={<RowIcon name="call" />}
          content={
            <ExternalLink newTab={false} href="tel:+1-587-864-4413">
              +1 (587) 864-4413
            </ExternalLink>
          }
        />
      </Row>

      <Row>
        <IconWithContent
          icon={<RowIcon name="link" />}
          content={
            <ExternalLink href="https://secondcup.com/en">
              secondcup.com
            </ExternalLink>
          }
        />
      </Row>
    </div>
  );
}

function Row({ children }) {
  return <div className={clsx(["min-h-[44px] px-[4px]"])}>{children}</div>;
}

/**
 * @param {object} props
 * @param {ReactElement} props.children
 * @param {boolean} isInitiallyExpanded - Defaults to `false`.
 */
function Disclosure({ children, isInitiallyExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);

  const onToggleExpanded = useCallback(
    () => setIsExpanded((isExpanded) => !isExpanded),
    [isExpanded]
  );

  return (
    <div className={clsx(["flex flex-row gap-0 justify-between"])}>
      {typeof children === "function" ? children(isExpanded) : children}
      <DisclosureToggleButton
        isExpanded={isExpanded}
        onToggleExpanded={onToggleExpanded}
      />
    </div>
  );
}

/**
 * @param {object} props
 * @param {boolean} props.isExpanded
 * @param {function} props.onToggleExpanded
 */
function DisclosureToggleButton({ isExpanded, onToggleExpanded }) {
  return (
    <button
      className={clsx([
        "h-touch w-touch",
        "flex flex-row items-center justify-center",
        "group",
      ])}
      onClick={onToggleExpanded}
    >
      <MaterialIcon
        name="chevron_right"
        className={clsx([
          "text-[24px] w-[24px] h-[24px] opsz-24 grad-0 dark:grad-n25 font-normal",
          "text-[#888888] group-active:text-[rgb(91,91,91)]",
          "transition-[transform] duration-300 ease-[cubic-bezier(.16,1,.56,1)]",
        ])}
        style={{
          transform: isExpanded ? "rotate(270deg)" : "rotate(90deg)",
        }}
      />
    </button>
  );
}

function IconWithContent({ icon, content, flexAlignClasses = "items-center" }) {
  return (
    <div
      className={clsx([
        //"h-[24px]", // whyyyyyyyyy is it 30px
        "mx-[10px] my-[10px]",
        "flex flex-row gap-[12px]",
        flexAlignClasses,
      ])}
    >
      {icon}
      {content}
    </div>
  );
}

/**
 * Renders a row icon. See `MaterialIcon` for info on `name`.
 *
 * @param {object} props
 * @param {string} props.name - The Material Symbols icon name in lower-snakecase.
 */
function RowIcon({ name }) {
  return (
    <MaterialIcon
      name={name}
      className="text-[24px] w-[24px] h-[24px] opsz-24 grad-0 dark:grad-n25 font-normal text-[#888888]"
    />
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

function ConciseAddress({ feature }) {
  return (
    <span className="text-[.938rem] leading-[.938rem]">
      3 St SE, Calgary AB, T2G 2E7
    </span>
  );
}

function DetailedAddress({ feature }) {
  return (
    <p className="text-[.938rem] leading-[1.3rem]">
      3 Street SE
      <br />
      Calgary, Alberta, Canada
      <br />
      T2G 2E7
    </p>
  );
}
// [end] Row-specific stuff
