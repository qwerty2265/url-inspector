import type { Table } from "@tanstack/react-table";

interface TablePaginationProps {
  table: Table<any>;
}

export default function TablePagination({ table }: TablePaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mt-2">
      <div className="flex gap-2">
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </button>
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
      <span className="text-xs">
        Page{" "}
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </span>
      <select
        className="border rounded px-1 py-0.5 text-xs"
        value={table.getState().pagination.pageSize}
        onChange={e => table.setPageSize(Number(e.target.value))}
      >
        {[10, 20, 50].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
}