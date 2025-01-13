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

import { clsx } from "clsx";
import { useState, useEffect, useRef } from "react";
import ML from "maplibre-gl";

import { randomLowerAlphaNumericString } from "/wander/common/strings";

import { rasterStyle, vectorStyle } from "./maplibre/styles";
import { cafes } from "/wander/maps/data/places";

const initialCenter = { longitude: -114.0716, latitude: 51.0428 };

const markerIcons = {
  small: (() => {
    const ns = "http://www.w3.org/2000/svg";
    const icon = document.createElementNS(ns, "svg");

    const size = "22";

    icon.setAttribute("width", size);
    icon.setAttribute("height", size);
    icon.setAttribute("viewBox", "0 0 46 46");
    icon.setAttribute("fill", "none");
    icon.setAttribute("xmlns", ns);

    const fill = "#37acff";
    const stroke = "#3b86bb";

    icon.innerHTML = `<g filter="url(#filter0_d_119_161)"><circle cx="23" cy="22" r="14" fill="${fill}"/><circle cx="23" cy="22" r="15" stroke="${stroke}" stroke-width="2"/></g><defs><filter id="filter0_d_119_161" x="0" y="0" width="46" height="46" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_119_161"/><feOffset dy="1"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_119_161"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_119_161" result="shape"/></filter></defs>`;

    return icon;
  })(),
};

export function MapLibreMap({ sizeClasses }) {
  const mapNodeId = useRef(`MapLibreMap-${randomLowerAlphaNumericString()}`);
  const mapRef = useRef(null);
  const [pointerPosition, setPointerPosition] = useState(initialCenter);

  useEffect(() => {
    if (mapRef.current === null) {
      initMap();
      addMarkers();
    }
  }, []);

  function initMap() {
    if (mapRef.current !== null) {
      return;
    }

    const map = new ML.Map({
      container: mapNodeId.current,
      style: vectorStyle,
      attributionControl: {
        compact: false,
        customAttribution: "&copy; OpenStreetMap",
      },
      center: [initialCenter.longitude, initialCenter.latitude],
      zoom: 13,
    });

    if (map === null || map === undefined) {
      throw new Error("failed to create MapLibre map");
    }
    mapRef.current = map;

    map.addControl(
      new ML.NavigationControl({
        visualizePitch: true,
        visualizeRoll: true,
        showZoom: true,
        showCompass: true,
      })
    );

    map.on("mousemove", (e) => {
      const longitude = e.lngLat["lng"];
      const latitude = e.lngLat["lat"];
      setPointerPosition({ longitude: longitude, latitude: latitude });
    });
  }

  function addMarkers() {
    addCafeMarkers();
  }

  function addCafeMarkers() {
    const points = cafes.filter((e) => {
      if (!Object.hasOwn(e, "type")) {
        return false;
      }
      const elementType = e["type"];

      if (elementType !== "Feature") {
        return false;
      }

      if (!Object.hasOwn(e, "geometry")) {
        return false;
      }
      const geometry = e["geometry"];

      if (!Object.hasOwn(geometry, "type")) {
        return false;
      }
      const geometryType = geometry["type"];

      return geometryType === "Point" && Object.hasOwn(geometry, "coordinates");
    });

    const markers = points.map((feature) => {
      const [longitude, latitude] = feature["geometry"]["coordinates"];
      const name = feature["properties"]["name"] ?? "Café (name unknown)";
      const popup = new ML.Popup().setText(name);

      const marker = new ML.Marker({
        element: markerIcons.small.cloneNode(true),
      })
        .setLngLat([longitude, latitude])
        .setPopup(popup);

      return marker;
    });

    console.log(`Number of cafe points: ${points.length}`);
    console.log(`Number of cafe markers: ${markers.length}`);

    markers.forEach((marker) => {
      marker.addTo(mapRef.current);
    });
  }

  return (
    // prettier-ignore
    <div className="h-full static z-0">
      <PointerPositionPanel position={pointerPosition} />
      <div id={mapNodeId.current} className={clsx([
        "h-full",
        "bg-gray-300"
      ])}></div>
    </div>
  );
}

function PointerPositionPanel({ position }) {
  const { longitude, latitude } = position;
  const ref = useRef(null);

  return (
    <div
      id="pointer-position-panel"
      className={clsx([
        "absolute bottom-0 left-0 z-[1]",
        "text-black bg-[rgb(255_255_255_/_0.6)]",
        "dark:text-white dark:bg-[rgb(0_0_0_/_0.6)]",
        "rounded-tr-md",
      ])}
      ref={ref}
    >
      <div
        className={clsx([
          //"pl-[calc(theme(spacing[touch/4])+env(safe-area-inset-left))]",
          "pl-touch/4",
          "py-touch/8 pr-touch/4",
          "text-xs",
        ])}
      >
        Cursor: {longitude.toFixed(4)}, {latitude.toFixed(4)}
      </div>
    </div>
  );
}
