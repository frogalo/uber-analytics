// components/ui/ChartComponents.tsx
"use client";

import * as React from "react";
import {TooltipProps} from "recharts";

import Card from "@/components/ui/card";
import {cn} from "@/lib/utils";

interface ChartTooltipContentProps<TValue, TName, TPayload>
    extends Omit<TooltipProps<TValue, TName, TPayload>, "payload"> {
    payload?: { name: string; value: number; color: string; month: string }[];
    monthlyData: {
        month: string;
        totalSpent: number;
        totalDistance: number;
        totalRides: number;
        avgPricePerKm?: number;
        avgPricePerRide?: number;
    }[];
}

export function ChartTooltipContent<TValue, TName, TPayload>({
                                                                 active,
                                                                 payload,
                                                                 className,
                                                                 monthlyData,
                                                             }: ChartTooltipContentProps<TValue, TName, TPayload>) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const activeMonth = payload[0].payload.month;
    const monthData = monthlyData?.find((item) => item.month === activeMonth);
    const totalRides = monthData ? monthData.totalRides : 0;
    const totalDistance = monthData ? monthData.totalDistance : 0;
    const totalSpent = monthData ? monthData.TotalSpent : 0;
    const avgPricePerKm = monthData ? monthData.avgPricePerKm : 0;
    const avgPricePerRide = monthData ? monthData.avgPricePerRide : 0;

    // Format the month date to show in a better way
    const formattedMonth = monthData
        ? new Date(monthData.month + "-01").toLocaleDateString("pl-PL", {
            month: "long",
            year: "numeric",
        })
        : "";

    return (
        <Card className={cn("w-[280px]", className)}>
            <div className="px-4 py-5 sm:p-6">
                <div className="text-sm text-gray-600 flex justify-between font-medium pb-3">
                    <h3 className="text-base font-semibold tracking-tight">
                        {formattedMonth}
                    </h3>
                </div>
                <div className="grid gap-1">
                    <div className="text-sm text-gray-600 flex justify-between font-medium">
                        <span>Total Rides:</span>
                        <span className="font-bold">{totalRides}</span>
                    </div>
                    <div className="text-sm text-gray-600 flex justify-between font-medium">
                        <span>Total Distance:</span>
                        <span className="font-bold">{totalDistance.toFixed(2)} km</span>
                    </div>
                    <div className="text-sm text-gray-600 flex justify-between font-medium">
                        <span>Total Spent:</span>
                        <span className="font-bold">
              {" "}
                            {typeof totalSpent === "number"
                                ? totalSpent.toFixed(2)
                                : totalSpent}{" "}
                            zł{" "}
            </span>
                    </div>
                    <div className="text-sm text-gray-600 flex justify-between font-medium">
                        <span>Avg Price/Km:</span>
                        <span className="font-bold">
              {" "}
                            {typeof avgPricePerKm === "number"
                                ? avgPricePerKm.toFixed(2)
                                : avgPricePerKm}{" "}
                            zł{" "}
            </span>
                    </div>
                    <div className="text-sm text-gray-600 flex justify-between font-medium">
                        <span>Avg Price/Ride:</span>
                        <span className="font-bold">
              {" "}
                            {typeof avgPricePerRide === "number"
                                ? avgPricePerRide.toFixed(2)
                                : avgPricePerRide}{" "}
                            zł{" "}
            </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function ChartContainer({
                                   className,
                                   children,
                                   ...props
                               }: ChartContainerProps) {
    return (
        <div className={cn("w-full rounded-md border", className)} {...props}>
            {children}
        </div>
    );
}
