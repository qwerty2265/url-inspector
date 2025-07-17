import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import Spinner from "../Spinner";

describe("Spinner", () => {
  it("renders spinner svg", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status").querySelector("svg")).toBeInTheDocument();
  });
});