/*
 * Copyright (c) 2025 Peyton Seigo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useRef, useState } from "react";

export function useOsmCafes() {
  const [cafes, setCafes] = useState([]);

  useEffect(() => {
    getCafesAndStore(setCafes);
  }, []);

  return [cafes];
}

async function getCafesAndStore(setCafes) {
  let cafes = null;

  try {
    cafes = await getCafes();
    //console.log("got cafes", cafes);
  } catch(error) {
    console.error("failed to get cafes", error);
    return;
  }

  setCafes(cafes);
}

async function getCafes() {
  const url = "/api/osm/pois/cafes";

  // TODO: Set caching policy. We'll use the built-in HTTP request caching
  //  mechanism to make sure we don't request twice on-mount in dev mode (rather
  //  than doing something hacky).

  const response = await fetch(url);
  //console.log("[getCafes/0] got response", response);

  const responseData = await response.json();
  //console.log("[getCafes/0] got responseData", responseData);

  return responseData;
}
