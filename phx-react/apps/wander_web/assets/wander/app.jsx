import { clsx } from "clsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, useLocation } from "wouter";
import { Button } from "/wander/common/components/button";

function App() {
  const [location, navigate] = useLocation();

  return (
    <div>
      <h1>Hello, world!</h1>

      <p>
        The location is <code>{location}</code>.
      </p>

      <Route path="/">
        <p>Home.</p>
        <Button label="Start Mapping!" onClick={() => navigate("/map")} />
      </Route>

      <Route path="/map">
        <p>{"I'm a map!"}</p>
      </Route>
    </div>
  );
}

function init() {
  // Clear the existing HTML content
  document.body.innerHTML = '<div id="app"></div>';

  // Render your React component instead
  const root = createRoot(document.getElementById("app"));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// Uncomment this line to replace every page with the React example.
init();
