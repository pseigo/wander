/** @type {import("jest").Config} */
const config = {
  testEnvironment: "jsdom",
  moduleDirectories: [
    "node_modules",
    "test",
    //"support"
  ],
  moduleFileExtensions: ["js", "jsx", "cjs", "mjs", "ts", "tsx", "json", "node"],
  extensionsToTreatAsEsm: [".jsx"],
  /*
  moduleNameMapper: {
    "/wander/(.*)": "<rootDir>/wander/$1"
  },
  */
  transform: {
    "\\.[jt]sx?$": "@swc/jest"
  }
}

module.exports = config;
