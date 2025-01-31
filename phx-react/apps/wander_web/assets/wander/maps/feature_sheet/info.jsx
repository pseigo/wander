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
import { useEffect, useMemo, useState } from "react";

import { Disclosure } from "/wander/common/components/disclosure";

import { AddressRow, MockAddressRow } from "./info/address_row";
import { CoordinatesRow } from "./info/coordinates_row";
import { OpeningHoursRow } from "./info/opening_hours_row";
import { PhoneNumberRow } from "./info/phone_number_row";
import { WebsiteRow } from "./info/website_row";

/**
 * @typedef {{houseNumber?: string, street?: string, city?: string, province?: string, postalCode?: string}} Address
 */

export function Info({ feature }) {
  return (
    <div className={clsx(["w-full"])}>
      <Rows feature={feature} />
    </div>
  );
}

function Rows({ feature }) {
  useEffect(() => {
    console.log("[FeatureSheet][mount] feature: ", feature);
    console.log(
      `[FeatureSheet][mount] feature.properties.opening_hours: '${feature.properties.opening_hours}'`
    );
    console.log(
      `[FeatureSheet][mount] feature.properties.phone: '${feature.properties.phone}'`
    );
    console.log(
      `[FeatureSheet][mount] feature.properties.website: '${feature.properties.website}'`
    );
    console.log(
      `[FeatureSheet][mount] feature.properties['addr:housenumber']: '${feature.properties["addr:housenumber"]}'`
    );
    console.log(
      `[FeatureSheet][mount] feature.properties['addr:street']: '${feature.properties["addr:street"]}'`
    );
    console.log(
      `[FeatureSheet][mount] feature.properties['addr:postcode']: '${feature.properties["addr:postcode"]}'`
    );
  }, []);

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

  return (
    <div className={clsx(["flex flex-col gap-0", "divide-y border-[#e1e1e1]"])}>
      {openingHours !== undefined && <OpeningHoursRow />}
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
    </div>
  );
}

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
