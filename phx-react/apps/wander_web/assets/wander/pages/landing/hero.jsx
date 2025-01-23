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
  contentMaxWidthClass,
  horizontalGutterPaddingClasses,
} from "./constants";

export function Hero() {
  const [_location, navigate] = useLocation();

  return (
    /* Full-width banner and inner styles. */
    <div
      className={clsx([
        horizontalGutterPaddingClasses,
        "pt-[calc(theme(spacing.touch*5/4)+env(safe-area-inset-top))] pb-touch*5/4",
        "bg-[#007ed7] dark:bg-[rgb(0,62,107)]",
        "text-center text-white",
      ])}
    >
      {/* Constrain inner width. */}
      <div className={clsx([contentMaxWidthClass, "mx-auto text-center"])}>
        <hgroup>
          <h2 className="text-2xl mb-3">Browse your city</h2>
          <p className="text-lg leading-6 mb-8">
            Cafés, restaurants, parks, shops, and more. <br /> Crowdsourced by
            your community.
          </p>
        </hgroup>

        <Button
          label="Start Exploring"
          className="w-full"
          size="large"
          theme="white"
          onClick={() => navigate("/map")}
        />
      </div>
    </div>
  );
}
