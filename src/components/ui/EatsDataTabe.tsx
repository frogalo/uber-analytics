// components/ui/EatsDataTable.tsx
"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,

    ColumnFiltersState, getFilteredRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
// import { format } from 'date-fns'; // Import date-fns for formatting
// import { pl } from 'date-fns/locale';// Import locale to have Polish dates if needed

interface EatsData {
    City_Name: string;
    Restaurant_Name: string;
    Request_Time_Local: string;
    Final_Delivery_Time_Local: string;
    Order_Status: string;
    Item_Name: string;
    Item_quantity: number;
    Customizations: string;
    Customization_Cost_Local: number;
    Special_Instructions: string;
    Item_Price: number;
    Order_Price: number;
    Currency: string;
}

interface EatsDataTableProps {
    data: EatsData[];
}

const EatsDataTable: React.FC<EatsDataTableProps> = ({ data }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const columns: ColumnDef<EatsData>[] = [
        { accessorKey: "City_Name", header: "City" },
        { accessorKey: "Restaurant_Name", header: "Restaurant" },
        { accessorKey: "Request_Time_Local", header: "Request Time" },
        { accessorKey: "Final_Delivery_Time_Local", header: "Delivery Time" },
        { accessorKey: "Order_Status", header: "Status" },
        { accessorKey: "Item_Name", header: "Item" },
        { accessorKey: "Item_quantity", header: "Quantity" },
        { accessorKey: "Customizations", header: "Customizations" },
        { accessorKey: "Customization_Cost_Local", header: "Customization Cost" },
        { accessorKey: "Special_Instructions", header: "Instructions" },
        { accessorKey: "Item_Price", header: "Item Price" },
        { accessorKey: "Order_Price", header: "Order Price" },
        { accessorKey: "Currency", header: "Currency" },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default EatsDataTable;
