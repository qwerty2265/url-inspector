import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import TablePagination from "../TablePagination";

const fakeTable = {
  previousPage: () => {},
  nextPage: () => {},
  getCanPreviousPage: () => false,
  getCanNextPage: () => false,
  getState: () => ({ pagination: { pageIndex: 0, pageSize: 10 } }),
  getPageCount: () => 1,
  setPageSize: () => {},
};

describe("TablePagination", () => {
  it("renders pagination controls", () => {
    render(<TablePagination table={fakeTable as any} />);
    expect(screen.getByText(/page/i)).toBeInTheDocument();
    expect(screen.getByText(/prev/i)).toBeInTheDocument();
    expect(screen.getByText(/next/i)).toBeInTheDocument();
  });
});