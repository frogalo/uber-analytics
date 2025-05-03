// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Car, Utensils } from "lucide-react"; // Import Lucide icons
import Link from "next/link";

export default function Home() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] overflow-hidden">
            <h1 className="text-4xl font-bold mb-8">Welcome to Uber Analytics</h1>
            <p className="text-gray-600 mb-8">Choose a service to view analytics:</p>

            <div className="flex space-x-4">
                <Link
                    href="/rides"
                    className="text-2xl flex items-center bg-[var(--color-chart-4)] hover:bg-[var(--color-chart-1)] text-white font-bold py-2 px-4 rounded"
                >
                    <Car className="mr-2" size={30} />
                    Uber Rides
                </Link>
                <Link
                    href="/eats"
                    className="text-2xl flex items-center bg-[var(--color-chart-4)] hover:bg-[var(--color-chart-1)] text-white font-bold py-2 px-4 rounded"
                >
                    <Utensils className="mr-2" size={30} />
                    Uber Eats
                </Link>
            </div>
        </div>
    );
}
