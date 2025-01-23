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

export function Explainer({ children, id }) {
  return (
    <div id={id} className="mb-14 last:mb-0">
      {children}
    </div>
  );
}

Explainer.Title = function Title({ children }) {
  return <h2 className="text-2xl leading-8 mb-4">{children}</h2>;
};

Explainer.Points = function Points({ children }) {
  return <ul className="list-disc list-outside pl-[1.3em]">{children}</ul>;
};

Explainer.Point = function Point({ children }) {
  return <li className="leading-6 mb-4 last:mb-0">{children}</li>;
};
