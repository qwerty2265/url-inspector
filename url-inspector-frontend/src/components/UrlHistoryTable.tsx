import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { Url } from "../api/url/url-types";
import TableSearch from "./TableSearch";
import TablePagination from "./TablePagination";

interface UrlHistoryTableProps {
  urls: Url[];
  onBulkDelete?: (ids: number[]) => void;
  onBulkRerun?: (ids: number[]) => void;
  onStop?: (id: number) => void;
  onResume?: (id: number) => void;
}

export default function UrlHistoryTable({
  urls,
  onBulkDelete,
  onBulkRerun,
  onStop,
  onResume,
}: UrlHistoryTableProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === urls.length) {
      setSelected([]);
    } else {
      setSelected(urls.map((u) => u.id));
    }
  };

  const columns = useMemo<ColumnDef<Url, any>[]>(
    () => [
      {
        id: "select",
        header: () => (
          <input
            type="checkbox"
            checked={selected.length === urls.length && urls.length > 0}
            onChange={toggleSelectAll}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selected.includes(row.original.id)}
            onChange={() => toggleSelect(row.original.id)}
            aria-label="Select row"
            onClick={e => e.stopPropagation()}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "page_title",
        header: "Title",
        enableSorting: true,
        cell: ({ row }) => (
          <span>
            {row.original.page_title && row.original.page_title.trim() !== ""
              ? row.original.page_title
              : "—"}
          </span>
        ),
      },
      {
        accessorKey: "html_version",
        header: "HTML Version",
        enableSorting: true,
        cell: ({ row }) => (
          <span>
            {row.original.html_version && row.original.html_version.trim() !== ""
              ? row.original.html_version
              : "—"}
          </span>
        ),
      },
      { accessorKey: "h1_count", header: "H1", enableSorting: true },
      { accessorKey: "h2_count", header: "H2", enableSorting: true },
      { accessorKey: "h3_count", header: "H3", enableSorting: true },
      { accessorKey: "h4_count", header: "H4", enableSorting: true },
      { accessorKey: "h5_count", header: "H5", enableSorting: true },
      { accessorKey: "h6_count", header: "H6", enableSorting: true },
      { accessorKey: "internal_links_count", header: "Internal Links", enableSorting: true },
      { accessorKey: "external_links_count", header: "External Links", enableSorting: true },
      { accessorKey: "broken_links_count", header: "Broken Links", enableSorting: true },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
        cell: ({ row }) => {
          const status = row.original.status;
          let color = "text-gray-700";
          if (status === "done") color = "text-green-600 font-semibold";
          else if (status === "error") color = "text-red-600 font-semibold";
          else if (status === "running") color = "text-yellow-600 font-semibold";
          else if (status === "queued") color = "text-blue-600 font-semibold";
          else if (status === "stopped") color = "text-gray-400 font-semibold";
          return <span className={color}>{status}</span>;
        },
      },
      {
        accessorKey: "url",
        header: "URL",
        enableSorting: true,
        cell: ({ row }) => (
          <a
            href={row.original.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
            onClick={e => e.stopPropagation()}
          >
            {row.original.url}
          </a>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const { id, status } = row.original;
          return (
            <div className="flex gap-2">
              {status === "running" && (
                <button
                  className="px-2 py-1 bg-yellow-500 text-white rounded text-xs cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStop?.(id);
                  }}
                >
                  Stop
                </button>
              )}
              {status === "stopped" && (
                <button
                  className="px-2 py-1 bg-green-600 text-white rounded text-xs cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onResume?.(id);
                  }}
                >
                  Resume
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [selected, urls, onStop, onResume]
  );

  const sortedUrls = useMemo(() => {
    if (sorting.length === 0) return urls;
    const [{ id, desc }] = sorting;
    return [...urls].sort((a, b) => {
      const aValue = a[id as keyof Url];
      const bValue = b[id as keyof Url];
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (aValue === bValue) return 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        return desc ? bValue - aValue : aValue - bValue;
      }
      return desc
        ? String(bValue).localeCompare(String(aValue))
        : String(aValue).localeCompare(String(bValue));
    });
  }, [urls, sorting]);

  const paginatedUrls = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedUrls.slice(start, end);
  }, [sortedUrls, pagination.pageIndex, pagination.pageSize]);

  const pageCount = Math.ceil(urls.length / pagination.pageSize);

  const table = useReactTable({
    data: paginatedUrls,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount,
  });

  if (!urls || urls.length === 0) {
    return <div className="text-center text-gray-500">No URLs yet.</div>;
  }

  return (
    <div className="overflow-x-auto w-full">
      <div className="mb-2 flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center">
        <TableSearch value={globalFilter} onChange={setGlobalFilter} />
        <button
          className="px-3 py-1 bg-red-500 text-white rounded text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          disabled={selected.length === 0}
          onClick={() => onBulkDelete?.(selected)}
        >
          Delete Selected
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          disabled={selected.length === 0}
          onClick={() => onBulkRerun?.(selected)}
        >
          Re-run Selected
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm text-xs sm:text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-2 sm:px-3 py-2 border-b text-left whitespace-nowrap cursor-pointer select-none"
                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span>
                        {header.column.getIsSorted() === "asc"
                          ? " ▲"
                          : header.column.getIsSorted() === "desc"
                          ? " ▼"
                          : " -"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/url-stats/${row.original.id}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-2 sm:px-3 py-2 border-b align-top max-w-[120px] sm:max-w-xs truncate"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination table={table} />
    </div>
  );
}