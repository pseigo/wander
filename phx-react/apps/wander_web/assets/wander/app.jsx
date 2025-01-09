import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  return <h1>Hello, world!</h1>;
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
