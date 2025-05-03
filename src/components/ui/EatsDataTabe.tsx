// components/ui/EatsDataTable.tsx
"use client";

import React, { useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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

interface GroupedOrder {
    Request_Time_Local: string;
    items: EatsData[];
}

interface EatsDataTableProps {
    data: GroupedOrder[];
}

const EatsDataTable: React.FC<EatsDataTableProps> = ({ data }) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const toggleExpandedRow = (requestTime: string) => {
        setExpandedRow(expandedRow === requestTime ? null : requestTime);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Request Time</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Items</TableHead>
                    <TableHead>Order Price</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((order) => (
                    <React.Fragment key={order.Request_Time_Local}>
                        <TableRow>
                            <TableCell>{order.Request_Time_Local}</TableCell>
                            <TableCell>{order.items[0].Restaurant_Name}</TableCell>
                            <TableCell>{order.items[0].Order_Status}</TableCell>
                            <TableCell>{order.items.length}</TableCell>
                            <TableCell>{order.items[0].Order_Price} {order.items[0].Currency}</TableCell>
                            <TableCell>
                                <button
                                    onClick={() => toggleExpandedRow(order.Request_Time_Local)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs"
                                >
                                    {expandedRow === order.Request_Time_Local ? "Hide Items" : "Show Items"}
                                </button>
                            </TableCell>
                        </TableRow>
                        {expandedRow === order.Request_Time_Local && (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Item</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Customizations</TableHead>
                                                <TableHead>Item Price</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {order.items.map((item, itemIndex) => (
                                                <TableRow key={itemIndex}>
                                                    <TableCell>{item.Item_Name}</TableCell>
                                                    <TableCell>{item.Item_quantity}</TableCell>
                                                    <TableCell>{item.Customizations}</TableCell>
                                                    <TableCell>{item.Item_Price} {item.Currency}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableCell>
                            </TableRow>
                        )}
                    </React.Fragment>
                ))}
            </TableBody>
        </Table>
    );
};

export default EatsDataTable;
