import { clsx } from "clsx";
import { useLocation } from "wouter";

import { Button } from "/wander/common/components/button";
import {
  useStaticDocumentTitle,
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
  const [_documentTitle] = useStaticDocumentTitle(
    "Wander: Browse places in your city"
  );

  return (
    <main
      aria-description={`A description of what Wander is, and "${ctaButtonLabel}" buttons that open the map.`}
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
