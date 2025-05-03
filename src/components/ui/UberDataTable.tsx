"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  FilterFn,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { UberData } from "@/lib/types";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { format, differenceInMinutes } from 'date-fns'; // Import date-fns for formatting
import { pl } from 'date-fns/locale';// Import locale to have Polish dates if needed

interface UberDataTableProps {
  data: UberData[];
}

// Custom filter function to filter by includes string
const includesFilter: FilterFn<UberData> = (row, columnId, value) => {
  return row.getValue(columnId)
    .toString()
    .toLowerCase()
    .includes(value.toLowerCase());
};

export default function UberDataTable({ data }: UberDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<UberData>[] = [
    {
      accessorKey: "city",
      header: "Miasto",
      filterFn: includesFilter, // Use custom filter function
    },
    {
      accessorKey: "product_type",
      header: "Typ produktu",
      filterFn: includesFilter, // Use custom filter function
    },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: includesFilter, // Use custom filter function
    },
       {
      accessorKey: "begin_trip_time",
      header: "Czas rozpoczęcia",
      cell: ({ row }) => {
        const beginTripTime = row.original.begin_trip_time;
        return beginTripTime
          ? format(new Date(beginTripTime), "dd/MM/yyyy HH:mm", { locale: pl })
          : "-";
      },
    },
    {
      id: "ride_duration",
      header: "Czas przejazdu",
      cell: ({ row }) => {
        const beginTripTime = row.original.begin_trip_time;
        const dropoffTime = row.original.dropoff_time;

        if (!beginTripTime || !dropoffTime) {
          return "-";
        }

        const begin = new Date(beginTripTime);
        const dropoff = new Date(dropoffTime);
        const duration = differenceInMinutes(dropoff, begin);

        return `${duration} minut`;
      },
    },
    {
      accessorKey: "distance",
      header: "Dystans",
      cell: ({ row }) => {
        const distance = row.original.distance;
        return distance ? `${distance} km` : "-";
      },
    },
     {
    accessorKey: "fare_amount",
    header: "Cena",
    cell: ({ row }) => {
      const fareAmount = row.original.fare_amount;
      return fareAmount ? `${fareAmount} zł` : "-";
    },
  },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Add filter
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters, // Add filter
    state: {
      sorting,
      columnFilters, // Add filter
    },
    filterFns: {
      includes: includesFilter, // Register custom filter function
    },
    globalFilter: "includes",
  });

  return (
    <div className="p-6 rounded-lg ">
      {/* Filtering */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter all columns..."
          className="p-3 w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-300"
          value={(table.getColumn("city")?.getFilterValue() as string) || ""}
          onChange={(e) => {
            table.getColumn("city")?.setFilterValue(e.target.value);
            table.getColumn("product_type")?.setFilterValue(e.target.value);
            table.getColumn("status")?.setFilterValue(e.target.value);
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " ⬆️",
                      desc: " ⬇️",
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-2 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
