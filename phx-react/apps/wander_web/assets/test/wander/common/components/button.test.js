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
