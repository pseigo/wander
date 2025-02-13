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

import { clsx } from "clsx";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { Disclosure } from "/wander/common/components/disclosure";
import { ExternalLink } from "/wander/common/components/link";
import { capitalize } from "/wander/common/strings";
import { weekdaysWithTimeRangeStrs } from "/wander/maps/osm/opening_hours";

import { Section } from "./info/section";
import { Row } from "./info/row";
import { IconWithContent, RowIcon } from "./info/icon_with_content";
import { AddressRow, MockAddressRow } from "./info/address_row";
import { CoordinatesRow } from "./info/coordinates_row";
import { OpeningHoursRow } from "./info/opening_hours_row";
import { PhoneNumberRow } from "./info/phone_number_row";
import { WebsiteRow } from "./info/website_row";
import { OsmIdRow } from "./info/osm_id_row";
import { OsmTagsRow } from "./info/osm_tags_row";

/**
 * @typedef {{houseNumber?: string, street?: string, city?: string, province?: string, postalCode?: string}} Address
 */
export function Info({ feature, currentDetent }) {
  const handleDragGesture = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      data-testid="feature-sheet__info"
      className={clsx([
        "w-full h-full",
        currentDetent !== "small" ? "overflow-y-scroll" : "overflow-y-hidden",
      ])}
      onPointerDown={handleDragGesture}
      onTouchStart={handleDragGesture}
      //onPointerMove={handleDragGesture}
      onTouchMove={handleDragGesture}
    >
      <div className="mb-[14px] select-none">
        <Sections feature={feature} />
      </div>
    </div>
  );
}

const Sections = memo(function Sections({ feature }) {
  return (
    <div className="flex flex-col gap-[18px]">
      <MainSection feature={feature} />
      <OsmSection feature={feature} />
    </div>
  );
});

const MainSection = memo(function MainSection({ feature }) {
  const openingHours = feature.properties.opening_hours;
  const phoneNumber = feature.properties.phone;
  const website = feature.properties.website;
  const [latitude, longitude] = feature.geometry.coordinates;
  const addrHousenumber = feature.properties["addr:housenumber"];
  const addrStreet = feature.properties["addr:street"];
  const addrPostcode = feature.properties["addr:postcode"];

  /** @type {Address} */
  const address = {
    houseNumber: addrHousenumber,
    street: addrStreet,
    postalCode: addrPostcode,
  };

  const openingHoursStrs = useMemo(
    () => weekdaysWithTimeRangeStrs(feature),
    [feature]
  );

  return (
    <Section>
      {openingHours !== undefined && (
        <OpeningHoursRow
          feature={feature}
          openingHoursStrs={openingHoursStrs}
        />
      )}
      {/*
      <MockAddressRow />
      */}
      {address !== undefined && addressHasSomeValidNonEmptyParts(address) && (
        <AddressRow address={address} />
      )}
      {phoneNumber !== undefined && (
        <PhoneNumberRow phoneNumber={phoneNumber} />
      )}
      {website !== undefined && <WebsiteRow website={website} />}
      <CoordinatesRow latitude={latitude} longitude={longitude} />
    </Section>
  );
});

/**
 * Returns `true` iff `address` has at least one defined field that is defined
 * and not an empty string.
 *
 * @param {Address} address
 *
 * @returns {boolean}
 */
function addressHasSomeValidNonEmptyParts(address) {
  for (const property in address) {
    const value = address[property];
    if (value !== undefined && value !== null && value !== "") {
      return true;
    }
  }

  return false;
}

const OsmSection = memo(function OsmSection({ feature }) {
  return (
    <Section title="OpenStreetMap" isLastSection={true}>
      <OsmIdRow feature={feature} />
      <OsmTagsRow feature={feature} />
    </Section>
  );
});
