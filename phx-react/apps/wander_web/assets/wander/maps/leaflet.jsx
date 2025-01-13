import { clsx } from "clsx";
import { useEffect, useRef } from "react";
import * as L from "/vendor/leaflet/leaflet-src.esm.js";

import { randomLowerAlphaNumericString } from "/wander/common/strings";

export function LeafletMap({ sizeClasses }) {
  const mapNodeId = useRef(`LeafletMap-${randomLowerAlphaNumericString()}`);
  const mapRef = useRef(null);

  useEffect(() => {
    initMap();
    mapRef.current.setView([51.505, -0.09], 13);
  }, []);

  function initMap() {
    if (mapRef.current !== null) {
      return;
    }

    mapRef.current = L.map(mapNodeId.current);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);
  }

  return (
    // prettier-ignore
    <div id={mapNodeId.current} className={clsx([
      "w-full h-full",
      "bg-gray-300"
    ])}></div>
  );
}
