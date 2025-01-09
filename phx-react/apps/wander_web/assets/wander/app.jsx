import { clsx } from "clsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, useLocation } from "wouter";

function App() {
  const [location, navigate] = useLocation();

  return <div>
    <h1>Hello, world!</h1>

    <p>The location is <code>{location}</code>.</p>

    <button
      className={clsx([
        "px-touch/2 min-h-touch",
        "rounded",

        "hover:shadow active:shadow-inner",

        "text-white",
        "bg-sky-500 hover:bg-sky-400 active:bg-sky-600",
        "border border-sky-600 hover:border-sky-500 active:border-sky-600",
        "transition-colors duration-100"
      ])}
      onClick={() => navigate("/map")}
    >
      Start Mapping!
    </button>

    <Route path="/">
      <p>{"Home."}</p>
    </Route>

    <Route path="/map">
      <p>{"I'm a map!"}</p>
    </Route>
  </div>;
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
