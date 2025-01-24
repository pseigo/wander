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

/**
 * A hook to read an element's current height. Uses `ResizeObserver`
 * internally.
 *
 * `elementRef` must be non-null by the time the component's effects run.
 *
 * @param {React.RefObject} elementRef
 *
 * @returns [integer] `[height]`
 */
export function useElementHeightObserver(elementRef) {
  const observerRef = useRef(null);
  const [observedHeight, setObservedHeight] = useState(0);

  useEffect(() => {
    observerRef.current = new ResizeObserver((entries) => {
      //const now = new Date().toISOString();

      for (const entry of entries) {
        const height = entry.borderBoxSize[0].blockSize;

        //console.log(`[${now}][useHeightObserver] entry`, entry);
        //console.log(`[${now}][useHeightObserver] height`, height.toFixed(3));

        setObservedHeight(height);
      }
    });

    observerRef.current.observe(elementRef.current);

    return () => {
      observerRef.current.disconnect();
      observerRef.current = null;
    };
  }, []);

  return [observedHeight];
}
