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

/**
 * @param {object} props
 * @param {string} props.title - Optional.
 * @param {boolean} props.isLastSection - Defaults to `false`.
 * @param {ReactElement} props.children
 */
export function Section({ title, isLastSection = false, children }) {
  const content = (
    <div
      className={clsx([
        "flex flex-col gap-0",
        "divide-y border-t border-[#e1e1e1]",
        !isLastSection && "border-b",
      ])}
    >
      {children}
    </div>
  );

  return title !== undefined && title !== null ? (
    <div className="flex flex-col gap-[3px]">
      <SectionTitle text={title} />
      {content}
    </div>
  ) : (
    content
  );
}

const SectionTitle = memo(function SectionTitle({ text }) {
  return <span className="mx-[14px] text-[.75rem] text-[#6A6A6A]">{text}</span>;
});
