import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Switch } from "wouter";

import { Route } from "/wander/common/router/route";
import { LandingPage } from "/wander/pages/landing";
import { MapPage } from "/wander/pages/map";
import { NotFoundErrorPage } from "/wander/pages/errors/not_found";

function App() {
  return (
    // prettier-ignore
    <Switch>
      <Route path="/"><LandingPage /></Route>
      <Route path="/map" Layout={null}><MapPage /></Route>
      <Route><NotFoundErrorPage /></Route>
    </Switch>
  );
}

function init() {
  const root = createRoot(document.getElementById("app"));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

init();
