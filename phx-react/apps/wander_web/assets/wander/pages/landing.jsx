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
import { useLocation } from "wouter";

import { Button } from "/wander/common/components/button";
import {
  useDocumentTitle,
  toDocumentTitle,
} from "/wander/common/hooks/document_title";

import {
  ctaButtonLabel,
  contentMaxWidthClass,
  horizontalGutterPaddingClasses,
} from "./landing/constants";
import { Hero } from "./landing/hero";
import { Explainers } from "./landing/explainers";

export function LandingPage(_props) {
  const [_location, navigate] = useLocation();
  useDocumentTitle(
    toDocumentTitle("Wander: Browse places in your city", {
      withSiteName: false,
    })
  );

  return (
    <main
      aria-description={`A description of what Wander is, and "${ctaButtonLabel}" buttons that open the map.`}
      className={clsx([
        "bg-white dark:bg-[#0f0f0f]",
        "text-black dark:text-white",
      ])}
    >
      <Hero />
      <div className={clsx([horizontalGutterPaddingClasses, "mt-8"])}>
        <div className={clsx([contentMaxWidthClass, "mx-auto"])}>
          <Explainers className="mb-14" />
          <Button
            label="Start Exploring"
            className="w-full"
            size="large"
            theme="black"
            onClick={() => navigate("/map")}
          />
        </div>
      </div>
    </main>
  );
}
