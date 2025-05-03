"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { ChevronUp, ChevronDown } from "lucide-react";

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

type SortKey =
    | "Request_Time_Local"
    | "Restaurant_Name"
    | "Order_Status"
    | "Order_Price"
    | "Total_Items"
    | null;

type SortDirection = "asc" | "desc";

export default function EatsDataTable({ data }: EatsDataTableProps) {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [filter, setFilter] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    // Filtering logic: filter by restaurant, status, or request time
    const filteredData = useMemo(() => {
        if (!filter) return data;
        const lower = filter.toLowerCase();
        return data.filter(
            (order) =>
                order.items[0].Restaurant_Name.toLowerCase().includes(lower) ||
                order.items[0].Order_Status.toLowerCase().includes(lower) ||
                order.Request_Time_Local.toLowerCase().includes(lower)
        );
    }, [data, filter]);

    // Sorting logic
    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData;
        const sorted = [...filteredData].sort((a, b) => {
            let aValue: any, bValue: any;
            switch (sortKey) {
                case "Request_Time_Local":
                    aValue = a.Request_Time_Local;
                    bValue = b.Request_Time_Local;
                    break;
                case "Restaurant_Name":
                    aValue = a.items[0].Restaurant_Name;
                    bValue = b.items[0].Restaurant_Name;
                    break;
                case "Order_Status":
                    aValue = a.items[0].Order_Status;
                    bValue = b.items[0].Order_Status;
                    break;
                case "Order_Price":
                    aValue = Number(a.items[0].Order_Price);
                    bValue = Number(b.items[0].Order_Price);
                    break;
                case "Total_Items":
                    aValue = a.items.length;
                    bValue = b.items.length;
                    break;
                default:
                    aValue = "";
                    bValue = "";
            }
            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortDirection === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            return sortDirection === "asc"
                ? aValue - bValue
                : bValue - aValue;
        });
        return sorted;
    }, [filteredData, sortKey, sortDirection]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    };

    const getSortIcon = (key: SortKey) => {
        if (sortKey !== key) return null;
        return sortDirection === "asc" ? (
            <ChevronUp className="inline w-4 h-4 ml-1" />
        ) : (
            <ChevronDown className="inline w-4 h-4 ml-1" />
        );
    };

    const toggleExpandedRow = (requestTime: string) => {
        setExpandedRow(expandedRow === requestTime ? null : requestTime);
    };

    return (
        <div className="p-6 rounded-lg">
            {/* Filtering */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Filtruj po restauracji, statusie lub dacie..."
                    className="p-3 w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-300"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            #
                        </th>
                        <th
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                            onClick={() => handleSort("Request_Time_Local")}
                        >
                            Czas zamówienia
                            {getSortIcon("Request_Time_Local")}
                        </th>
                        <th
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                            onClick={() => handleSort("Restaurant_Name")}
                        >
                            Restauracja
                            {getSortIcon("Restaurant_Name")}
                        </th>
                        <th
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                            onClick={() => handleSort("Order_Status")}
                        >
                            Status
                            {getSortIcon("Order_Status")}
                        </th>
                        <th
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                            onClick={() => handleSort("Total_Items")}
                        >
                            Liczba pozycji
                            {getSortIcon("Total_Items")}
                        </th>
                        <th
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                            onClick={() => handleSort("Order_Price")}
                        >
                            Cena zamówienia
                            {getSortIcon("Order_Price")}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Akcja
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {sortedData.map((order, orderIndex) => (
                        <React.Fragment key={order.Request_Time_Local}>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-2 whitespace-nowrap">{orderIndex + 1}</td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {order.Request_Time_Local
                                        ? format(new Date(order.Request_Time_Local), "dd/MM/yyyy HH:mm", { locale: pl })
                                        : order.Request_Time_Local}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">{order.items[0].Restaurant_Name}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{order.items[0].Order_Status}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{order.items.length}</td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {order.items[0].Order_Price} {order.items[0].Currency}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    <button
                                        onClick={() => toggleExpandedRow(order.Request_Time_Local)}
                                        style={{
                                            backgroundColor: "var(--color-chart-4)",
                                            color: "white",
                                            fontWeight: "bold",
                                            padding: "0.25rem 0.75rem",
                                            borderRadius: "0.375rem",
                                            fontSize: "0.75rem",
                                        }}
                                        className="hover:bg-[--chart-2] transition-colors"
                                    >
                                        {expandedRow === order.Request_Time_Local ? "Ukryj pozycje" : "Pokaż pozycje"}
                                    </button>
                                </td>
                            </tr>
                            {expandedRow === order.Request_Time_Local && (
                                <tr>
                                    <td colSpan={7} className="bg-gray-50">
                                        <div className="p-2">
                                            <table className="min-w-full bg-white border border-gray-200 rounded-md">
                                                <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pozycja</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ilość</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dodatki</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cena</th>
                                                </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                {order.items.map((item, itemIndex) => (
                                                    <tr key={itemIndex} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 whitespace-nowrap">{itemIndex + 1}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap">{item.Item_Name}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap">{item.Item_quantity}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap">{item.Customizations}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap">
                                                            {item.Item_Price} {item.Currency}
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
