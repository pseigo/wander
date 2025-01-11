import { useLocation } from "wouter";

import { Button } from "/wander/common/components/button";

export function MapPage(_props) {
  const [_location, navigate] = useLocation();

  return (
    <>
      <p>Map coming soon...</p>
      <Button label="Home" onClick={() => navigate("/")} />
    </>
  );
}
