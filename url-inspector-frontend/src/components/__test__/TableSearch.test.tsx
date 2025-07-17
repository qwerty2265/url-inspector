import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from "@testing-library/react";
import TableSearch from "../TableSearch";

describe("TableSearch", () => {
  it("renders input with placeholder", () => {
    render(<TableSearch value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    let value = "";
    render(<TableSearch value={value} onChange={v => value = v} />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "test" } });
    expect(value).toBe("test");
  });
});