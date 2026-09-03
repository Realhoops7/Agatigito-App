import React from "react";
import { createRoot } from "react-dom/client";
import { storage } from "./lib/storage.js";
import { GoogleMapsProvider } from "./lib/googleMaps.jsx";
import App from "./App.jsx";

// App.jsx calls window.storage.get/set(...) directly (that's how it worked
// as a Claude artifact). Attaching the shim here means App.jsx needs zero
// changes to run as a real app.
window.storage = storage;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleMapsProvider>
      <App />
    </GoogleMapsProvider>
  </React.StrictMode>
);
