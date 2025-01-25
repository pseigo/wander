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

import { useEffect, useState } from "react";

/**
 * A hook that returns the current viewport height.
 *
 * ## Internal details
 *
 * Internally, this returns `window.innerHeight` and updates when the window's
 * "resize" event fires. This may change in the future (not sure if
 * `window.innerHeight` is exactly what we want), so don't depend on these
 * details.
 *
 * Treat the returned `viewportHeight` as the entirety of the page that is
 * currently visible within the user's browser window, including 'unsafe' areas
 * (such as on smartphones with curved screen edges), but not anything that the
 * user can't see.
 *
 * @returns {[integer]} `[viewportHeight]`
 */
export function useViewportHeight() {
  const [observedViewportHeight, setObservedViewportHeight] = useState(
    window.innerHeight
  );

  useEffect(() => {
    const onWindowResize = () => {
      setObservedViewportHeight(window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize);

    // Initial update.
    setObservedViewportHeight(window.innerHeight);

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return [observedViewportHeight];
}

/*
 * # Development notes
 *
 * ## Future directions
 *
 * Let's keep an eye on these things if we need to revisit this hook in the
 * future:
 *
 * - `window.innerHeight` and "resize" event on `window` (initial implementation)
 * - `entry.borderBoxSize[0].blockSize` on `document.documentElement` observed
 *   with `ResizeObserver`
 * - `document.getElementsByTagName("html").item(0).offsetHeight`
 * - `document.documentElement.getBoundingClientRect().height`
 *
 */
