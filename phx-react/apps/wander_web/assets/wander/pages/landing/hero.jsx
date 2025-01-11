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
        "pt-[calc(theme(spacing.touch)+env(safe-area-inset-top))] pb-touch",
        "bg-[#007ed7]",
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
