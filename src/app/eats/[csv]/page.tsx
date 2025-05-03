// src/app/eats/[csv]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { parseCSVData } from "@/lib/csv-parser"; // Reuse CSV parser
import EatsDataTable from "@/components/ui/EatsDataTable";
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

const EatsAnalyticsPage = () => {
    const [eatsData, setEatsData] = useState<EatsData[]>([]);
    const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const csvFileName = params.csv;
    const [expandedRow, setExpandedRow] = useState<string | null>(null); // Track expanded row

    useEffect(() => {
        async function loadEatsData() {
            try {
                const csvString = localStorage.getItem(csvFileName);
                if (!csvString) {
                    setError("CSV file not found in local storage.");
                    setLoading(false);
                    return;
                }

                const parsedData = await parseCSVData(csvString) as EatsData[];
                setEatsData(parsedData);

                // Group orders by Request_Time_Local
                const grouped: { [key: string]: EatsData[] } = {};
                parsedData.forEach((item) => {
                    if (!grouped[item.Request_Time_Local]) {
                        grouped[item.Request_Time_Local] = [];
                    }
                    grouped[item.Request_Time_Local].push(item);
                });

                // Convert grouped object to array of GroupedOrder objects
                const groupedOrdersArray: GroupedOrder[] = Object.entries(grouped).map(([Request_Time_Local, items]) => ({
                    Request_Time_Local,
                    items,
                }));

                setGroupedOrders(groupedOrdersArray);
                setLoading(false);
            } catch (err:any) {
                console.error("Error loading and parsing CSV:", err);
                setError("Failed to load and parse CSV data.");
                setLoading(false);
            }
        }

        if (csvFileName) {
            loadEatsData();
        } else {
            setError("CSV file name not found.");
            setLoading(false);
        }
    }, [csvFileName]);

    if (loading) return <div>Loading Uber Eats data...</div>;
    if (error) return <div>Error: {error}</div>;

    const toggleExpandedRow = (requestTime: string) => {
        setExpandedRow(expandedRow === requestTime ? null : requestTime);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-lg font-semibold mb-2">File: {csvFileName}</h2>

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
                    {groupedOrders.map((order) => (
                        <React.Fragment key={order.Request_Time_Local}>
                            <TableRow >
                                <TableCell>{order.Request_Time_Local}</TableCell>
                                <TableCell>{order.items[0].Restaurant_Name}</TableCell>
                                <TableCell>{order.items[0].Order_Status}</TableCell>
                                <TableCell>{order.items.length}</TableCell>
                                <TableCell>{order.items[0].Order_Price} zł</TableCell>
                                <TableCell>
                                    <button
                                        onClick={() => toggleExpandedRow(order.Request_Time_Local)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs"
                                    >
                                        {expandedRow === order.Request_Time_Local ? 'Hide Items' : 'Show Items'}
                                    </button>
                                </TableCell>
                            </TableRow>
                            {expandedRow === order.Request_Time_Local && (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        {/* Nested table for items */}
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
                                                        <TableCell>{item.Item_Price} zł</TableCell>
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
        </div>
    );
};

export default EatsAnalyticsPage;
