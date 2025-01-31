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

import { useMemo } from "react";

import { ExternalLink } from "/wander/common/components/link";

import { IconWithContent, RowIcon } from "./icon_with_content";
import { Row } from "./row";

export function PhoneNumberRow({ phoneNumber }) {
  const normalizedPhoneNumber = useMemo(
    () => normalizePhoneNumberForDisplay(phoneNumber),
    [phoneNumber]
  );

  const telLink = useMemo(
    () => telLinkFromPhoneNumber(phoneNumber),
    [phoneNumber]
  );

  return (
    <Row>
      <IconWithContent
        icon={<RowIcon name="call" />}
        content={
          <ExternalLink newTab={false} href={telLink}>
            {normalizedPhoneNumber}
          </ExternalLink>
        }
      />
    </Row>
  );
}

function normalizePhoneNumberForDisplay(phoneNumber) {
  // TODO: stub
  return phoneNumber;

  // Examples of strings we'd like to normalize (all real examples from the OSM
  // dataset):
  //
  // +1-403-123-4567
  // +1-403 123-4567
  // +1 403 123 4567
  // +1 4031234567
  // +14031234567
  //
  // Would be nice to clean up the OSM dataset to conform to a standard style
  // (if there is such a thing, and if such changes are acceptable to the
  // community), but we should always print them in a standard style anyways,
  // because a crowdsourced dataset like this will never be 100% consistent...
}

/**
 * @see https://datatracker.ietf.org/doc/rfc3966/
 *
 * @param {string} phoneNumber
 *
 * @returns {string}
 */
function telLinkFromPhoneNumber(phoneNumber) {
  // TODO: stub
  const telLink = `tel:${phoneNumber.replaceAll(" ", "-")}`;
  return telLink;
}
