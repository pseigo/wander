/*
 * Copyright (c) 2025 Peyton Seigo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { render, screen } from "@testing-library/react";
import { Button } from "/wander/common/components/button";
//import { Button } from "../../wander/common/components/button";
//import { test, toBe } from "jest";
//import { test, describe, it } from "@jest/globals";

test("renders label", () => {
  const label = "Some Action";
  render(<Button label={label} />);

  screen.getByText(label);
  screen.getByRole("button", {name: label});
});
