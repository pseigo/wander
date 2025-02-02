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

import { openStateAtInstant } from "/wander/maps/osm/opening_hours";

/**
 * If `feature.properties.opening_hours` does not exist, `openState` will be
 * `null`. Otherwise, `openState` will be initialized on mount, and if a
 * duration to next state change string will be displayed, it will also be
 * refreshed every minute.
 *
 * @param {Feature} feature
 *
 * @returns {(OpenStateAtInstant | null)}
 */
export function useLiveOpenState(feature) {
  const [openState, setOpenState] = useState(currentOpenState(feature));
  const refreshTimerRef = useRef(null);

  // Update `openState` when the `feature` is set.
  useEffect(() => {
    if (feature === null) {
      clearRefreshTimer(refreshTimerRef);
      setOpenState(null);
      return;
    }

    const newOpenState = currentOpenState(feature);
    setOpenState(newOpenState);
  }, [feature]);

  // Initialize periodic refresh when the `feature` is set.
  useEffect(() => {
    clearRefreshTimer(refreshTimerRef);

    if (openState === null || openState.nextOpensOrClosesIn === undefined) {
      // No reason to periodically refresh if (a) there's no open state or (b)
      // we don't know when the state will change.
      return;
    }

    // Start refresh loop 1 second after the countdown's `seconds` part next
    // ticks down to 0 (i.e., when it underflows).
    const firstRefreshInMs = (openState.nextOpensOrClosesIn.seconds + 1) * 1000;
    refreshTimerRef.current = setTimeout(() => {
      refreshOpenStateLoop(feature, setOpenState, refreshTimerRef);
    }, firstRefreshInMs);

    return () => clearRefreshTimer(refreshTimerRef);
  }, [feature]);

  return openState;
}

/**
 * @param {React.RefObject<integer | null>} refreshTimerRef
 */
function clearRefreshTimer(refreshTimerRef) {
  if (refreshTimerRef.current !== null) {
    clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = null;
  }
}

/**
 * Returns information about the current open or closed state of the `feature`,
 * otherwise `null` if `feature.properties.opening_hours` is not valid.
 *
 * @param {Feature} feature
 *
 * @returns {(OpenStateAtInstant | null)}
 */
function currentOpenState(feature) {
  const now = new Date();
  const openState = openStateAtInstant(feature, now);
  return openState;
}

/**
 * @param {Feature} feature
 * @param {React.Dispatch<React.SetStateAction<OpenStateAtInstant>>} setOpenState
 * @param {React.RefObject<integer | null>}
 */
function refreshOpenStateLoop(feature, setOpenState, refreshTimerRef) {
  const openState = currentOpenState(feature);
  setOpenState(openState);

  const refreshInMs = 60 * 1000;
  if (refreshTimerRef.current !== null) {
    clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = null;
  }
  refreshTimerRef.current = setTimeout(() => {
    refreshOpenStateLoop(feature, setOpenState, refreshTimerRef);
  }, refreshInMs);
}
