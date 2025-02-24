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

import { MaterialIcon } from "/wander/common/components/icon";

import { SampleInnerScrollContainer } from "../sample_inner_scroll_container";

export const Index = memo(function Index({ collections }) {
  return (
    <>
      <Sections collections={collections} />
      <SampleInnerScrollContainer />
    </>
  );
});

const Sections = memo(function Sections({ collections }) {
  return (
    <Section>
      {collections.map((collection) => (
        <Row key={collection.id}>
          <RowContent
            label={collection.name}
            isFolder={collection.name === "Favourites"}
          />
        </Row>
      ))}
    </Section>
  );
});

const Section = memo(function Section({
  title,
  isLastSection = false,
  children,
}) {
  const content = (
    <div
      data-testid="feature-sheet__collections__section"
      className={clsx([
        "flex flex-col gap-0",
        "divide-y border-t border-[#e1e1e1]",
        !isLastSection && "border-b",
      ])}
    >
      {children}
    </div>
  );

  return title != null ? (
    <div className="flex flex-col gap-[3px]">
      <SectionTitle text={title} />
      {content}
    </div>
  ) : (
    content
  );
});

const SectionTitle = memo(function SectionTitle({ text }) {
  return <span className="mx-[14px] text-[.75rem] text-[#6A6A6A]">{text}</span>;
});

function Row({ children }) {
  return (
    <div
      className={clsx([
        "min-h-[44px] px-[4px]",
        "active:bg-[#eeeeee]",
        //"active:bg-[#eeeeee] active:shadow-inner"
      ])}
    >
      {children}
    </div>
  );
}

export function RowContent({
  label,
  isFolder = false,
  flexAlignClasses = "items-center",
}) {
  return (
    <div
      className={clsx([
        "mx-[10px] my-[10px]",
        "flex flex-row gap-[12px]",
        flexAlignClasses,
        "justify-between",
      ])}
    >
      <span className="text-[.938rem]">{label}</span>
      {!!isFolder && (
        <MaterialIcon
          name="chevron_right"
          className={clsx([
            "text-[24px] w-[24px] h-[24px] opsz-24 grad-0 dark:grad-n25 font-normal",
            "text-[#888888] group-active:text-[rgb(91,91,91)]",
          ])}
        />
      )}
    </div>
  );
}
