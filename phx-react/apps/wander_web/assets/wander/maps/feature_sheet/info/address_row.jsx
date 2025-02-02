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

import { intersperse } from "/wander/common/arrays";
import { Disclosure } from "/wander/common/components/disclosure";

import { IconWithContent, RowIcon } from "./icon_with_content";
import { Row } from "./row";

/**
 * @param {Address} address
 */
export function AddressRow({ address }) {
  const conciseAddress = useMemo(
    () => conciseAddressString(address),
    [address]
  );

  const detailedAddressParts = useMemo(
    () => verboseAddressParts(address),
    [address]
  );

  /*
  useEffect(() => {
    console.log("[AddressRow] conciseAddress: ", conciseAddress);
  }, []);
  */

  return (
    <Row>
      <Disclosure isInitiallyExpanded={false}>
        {(isExpanded) => (
          <IconWithContent
            icon={<RowIcon name="pin_drop" />}
            content={
              !isExpanded ? (
                <ConciseAddress conciseAddress={conciseAddress} />
              ) : (
                <DetailedAddress addressParts={detailedAddressParts} />
              )
            }
            flexAlignClasses={isExpanded ? "items-start" : undefined}
          />
        )}
      </Disclosure>
    </Row>
  );
}

// This is sort of what we want addresses to look like in the end:
export function MockAddressRow() {
  return (
    <Row>
      <Disclosure isInitiallyExpanded={false}>
        {(isExpanded) => (
          <IconWithContent
            icon={<RowIcon name="pin_drop" />}
            content={
              !isExpanded ? (
                <ConciseAddress conciseAddress="3 St SE, Calgary AB, T2G 2E7" />
              ) : (
                <DetailedAddress
                  addressParts={[
                    "3 Street SE",
                    "Calgary, Alberta, Canada",
                    "T2G 2E7",
                  ]}
                />
              )
            }
            flexAlignClasses={isExpanded ? "items-start" : undefined}
          />
        )}
      </Disclosure>
    </Row>
  );
}

function ConciseAddress({ conciseAddress }) {
  return (
    <span className="text-[.938rem] leading-[.938rem]">{conciseAddress}</span>
  );
}

function DetailedAddress({ addressParts }) {
  return (
    <p className="text-[.938rem] leading-[1.3rem]">
      {addressParts.map((part) => (
        <>
          {part}
          <br />
        </>
      ))}
    </p>
  );
}

/**
 * @param {Address} address
 *
 * @returns {string}
 */
function conciseAddressString(address) {
  const parts = [];

  // <HouseNumber> <Street>
  let streetWithHouseNumber = streetWithHouseNumberFromAddress(address);
  if (streetWithHouseNumber !== "") {
    parts.push(streetWithHouseNumber);
  }

  // <City> <ConciseProvince>
  let cityWithProvince = cityWithConciseProvinceFromAddress(address);
  if (cityWithProvince !== "") {
    parts.push(cityWithProvince);
  }

  // <PostalCode>
  if (isValidAndNonEmptyString(address.postalCode)) {
    parts.push(address.postalCode);
  }

  const interspersed = intersperse(parts, ", ");
  const concise = interspersed.reduce((acc, e) => acc + e, "");
  console.log("[conciseAddressString]", parts, address, concise);
  return concise;
}

/**
 * @param {Address} address
 *
 * @returns {[string]}
 */
function verboseAddressParts(address) {
  const parts = [];

  // <HouseNumber> <Street>
  let streetWithHouseNumber = streetWithHouseNumberFromAddress(address);
  if (streetWithHouseNumber !== "") {
    parts.push(streetWithHouseNumber);
  }

  // <City> <Province>
  let cityWithProvince = cityWithProvinceFromAddress(address);
  if (cityWithProvince !== "") {
    parts.push(cityWithProvince);
  }

  // <PostalCode>
  if (isValidAndNonEmptyString(address.postalCode)) {
    parts.push(address.postalCode);
  }

  return parts;
}

/**
 * Returns a string with the `address`'s house number and street name
 * concatenated, if those fields are present. If none of those fields are
 * present, an empty string `""` is returned.
 *
 * @param {Address} address
 *
 * @returns {string}
 */
function streetWithHouseNumberFromAddress(address) {
  let streetWithHouseNumber = "";

  if (isValidAndNonEmptyString(address.houseNumber)) {
    streetWithHouseNumber += address.houseNumber;
  }
  if (isValidAndNonEmptyString(address.street)) {
    if (streetWithHouseNumber !== "") {
      streetWithHouseNumber += " ";
    }

    streetWithHouseNumber += address.street;
  }

  return streetWithHouseNumber;
}

/**
 * Returns a string with the `address`'s city and a concise representation of
 * the province concatenated, if those fields are present. If none of those
 * fields are present, an empty string `""` is returned.
 *
 * @param {Address} address
 *
 * @returns {string}
 */
function cityWithConciseProvinceFromAddress(address) {
  let cityWithProvince = "";

  if (isValidAndNonEmptyString(address.city)) {
    cityWithProvince += address.city;
  }

  if (isValidAndNonEmptyString(address.province)) {
    if (cityWithProvince !== "") {
      cityWithProvince += " ";
    }

    const conciseProvince = conciseProvinceString(address.province);
    cityWithProvince += conciseProvince;
  }

  return cityWithProvince;
}

/**
 * Returns a string with the `address`'s city and province concatenated, if
 * those fields are present. If none of those fields are present, an empty
 * string `""` is returned.
 *
 * @param {Address} address
 *
 * @returns {string}
 */
function cityWithProvinceFromAddress(address) {
  let cityWithProvince = "";

  if (isValidAndNonEmptyString(address.city)) {
    cityWithProvince += address.city;
  }

  if (isValidAndNonEmptyString(address.province)) {
    if (cityWithProvince !== "") {
      cityWithProvince += " ";
    }

    cityWithProvince += address.province;
  }

  return cityWithProvince;
}

function isValidAndNonEmptyString(str) {
  return str !== undefined && str !== null && str !== "";
}

function conciseProvinceString(province) {
  // TODO: stub
  return province;
}
