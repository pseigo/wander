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
