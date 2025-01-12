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

import { InternalLink } from "/wander/common/components/link";

const horizontalGutterPaddingClasses =
  "pl-[max(theme(spacing[touch/4]),env(safe-area-inset-left))] " +
  "pr-[max(theme(spacing[touch/4]),env(safe-area-inset-right))]";

export function Header() {
  return (
    <header
      className={clsx([
        horizontalGutterPaddingClasses,
        "py-touch/10",

        "sticky top-0",

        "bg-[rgb(0,129,221)]",
        "border-b border-[rgb(0,120,206)]",
        "shadow-sm",
        "text-white",
      ])}
    >
      <nav className="max-w-[900px] mx-auto">
        <InternalLink href="/" unstyled className="text-xl">
          Wander
        </InternalLink>
      </nav>
    </header>
  );
}
