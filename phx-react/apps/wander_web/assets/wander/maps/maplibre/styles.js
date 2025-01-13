export const maplibre_demotiles = "https://demotiles.maplibre.org/style.json";

export const rasterStyle = {
  version: 8,
  name: "Blank",
  center: [0, 0],
  zoom: 0,
  sources: {
    "raster-tiles": {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      minzoom: 0,
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#e0dfdf",
      },
    },
    {
      id: "simple-tiles",
      type: "raster",
      source: "raster-tiles",
    },
  ],
  id: "blank",
};

export const vectorStyle = {
  version: 8,
  name: "Blank",
  center: [0, 0],
  zoom: 0,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    tiles: {
      type: "vector",
      tiles: ["https://vector.openstreetmap.org/shortbread_v1/{z}/{x}/{y}.mvt"],
      minzoom: 0,
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#f2f2f2",
      },
    },
    {
      id: "ocean",
      type: "fill",
      source: "tiles",
      "source-layer": "ocean",
      paint: { "fill-color": "#aad3df" },
    },
    {
      id: "water_polygons",
      type: "fill",
      source: "tiles",
      "source-layer": "water_polygons",
      paint: { "fill-color": "#AAD3DF" },
    },
    {
      id: "boundaries",
      type: "fill",
      source: "tiles",
      "source-layer": "boundaries",
      paint: { "fill-color": "#8d618b" },
    },
    {
      id: "grass",
      type: "fill",
      source: "tiles",
      "source-layer": "land",
      filter: ["in", ["get", "kind"], "leisure-park"],
      paint: { "fill-color": "#abe26f" },
    },
    {
      id: "streets",
      type: "line",
      source: "tiles",
      "source-layer": "streets",
      layout: { visibility: "visible" },
      paint: {
        "line-color": [
          "match",
          ["get", "kind"],
          "motorway",
          "#e66e89",
          ["trunk", "primary", "secondary"],
          "#f4c37d",
          "#ccccca",
        ],
      },
    },
    {
      id: "buildings",
      type: "fill",
      source: "tiles",
      "source-layer": "buildings",
      paint: { "fill-color": "#e2d9d3" },
    },
    {
      id: "places",
      type: "symbol",
      source: "tiles",
      "source-layer": "place_labels",
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Semibold"],
        "text-size": 16,
      },
      paint: {
        "text-halo-width": 1,
        "text-halo-color": "rgba(255, 255, 255, 1)",
      },
    },
  ],
  id: "blank",
};
