// src/app/eats/[csv]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { parseCSVData } from "@/lib/csv-parser";
import EatsDataTable from "../../../components/ui/EatsDataTabe";

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

                // Format name based on local save function.
                const dateMatch = csvFileName.match(/(\d{8}T\d{6})/)
                const formattedDate = dateMatch ? new Date(dateMatch[1]).toLocaleString() : csvFileName

                setDisplayDate(formattedDate);
                setLoading(false);
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

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-lg font-semibold mb-2">File: {csvFileName}</h2>
            {/* Display the data in a table */}
            <EatsDataTable data={groupedOrders} />


        </div>
    );
};

export default EatsAnalyticsPage;
