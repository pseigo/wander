import { useLocation } from "wouter";

import { Button } from "/wander/common/components/button";
import { useStaticDocumentTitle, toDocumentTitle } from "/wander/common/hooks/document_title";

export function MapPage(_props) {
  const [_location, navigate] = useLocation();
  const [_documentTitle] = useStaticDocumentTitle(toDocumentTitle("Map"));

  return (
    <>
      <p>Map coming soon...</p>
      <Button label="Home" onClick={() => navigate("/")} />
    </>
  );
}
