// src/app/eats/[csv]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { parseCSVData } from "@/lib/csv-parser"; // Reuse CSV parser
import EatsDataTable from "../../../components/ui/EatsDataTabe";
import Circle from "@/components/ui/Circle";

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
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const params = useParams();
    const csvFileName = params.csv;
    const [displayDate, setDisplayDate] = useState("");

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

                // Calculate total spent
                let totalOrderSpent = 0;
                parsedData.forEach((row: EatsData) => {
                    totalOrderSpent += Number(row.Item_Price || 0);
                });
                setTotalSpent(totalOrderSpent);

                // Calculate total items
                let totalItems = 0;
                parsedData.forEach((row: EatsData) => {
                    totalItems += Number(row.Item_quantity || 0);
                });
                setTotalItems(totalItems);

                // Format name based on local save function.
                const dateMatch = csvFileName.match(/(\d{8}T\d{6})/);
                const formattedDate = dateMatch
                    ? new Date(dateMatch[1]).toLocaleString()
                    : csvFileName;
                setDisplayDate(formattedDate);

                // Group orders by Request_Time_Local
                const grouped: { [key: string]: EatsData[] } = {};
                parsedData.forEach((item) => {
                    if (!grouped[item.Request_Time_Local]) {
                        grouped[item.Request_Time_Local] = [];
                    }
                    grouped[item.Request_Time_Local].push(item);
                });

                // Convert grouped object to array of GroupedOrder objects
                const groupedOrdersArray: GroupedOrder[] = Object.entries(grouped).map(
                    ([Request_Time_Local, items]) => ({
                        Request_Time_Local,
                        items,
                    })
                );
                setGroupedOrders(groupedOrdersArray);

                // FIX: totalOrders should be the number of unique orders
                const totalOrders = groupedOrdersArray.length;
                setTotalOrders(totalOrders);

                setLoading(false);
            } catch (err: any) {
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

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-lg font-semibold mb-2">File: {displayDate}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Circle
                    title="Total Spent"
                    value={totalSpent.toFixed(2)}
                    description="All Time"
                    unit=" zł"
                />
                <Circle
                    title="Total Orders"
                    value={totalOrders}
                    description="All Time (orders)"
                    unit= " "
                />
                <Circle
                    title="Total Items"
                    value={totalItems}
                    description="All Time (items)"
                    unit= " "
                />

            </div>

            {/* Display the data in a table */}
            <EatsDataTable data = {groupedOrders}/>


        </div>
    );
};

export default EatsAnalyticsPage;