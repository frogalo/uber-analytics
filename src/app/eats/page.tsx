// ./src/app/eats/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function UberEatsPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadMessage, setUploadMessage] = useState("");
    const [csvFiles, setCsvFiles] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        // Load CSV files from local storage on component mount
        const storedFiles = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("user_orders-")) {
                storedFiles.push(key);
            }
        }
        console.log(storedFiles);
        setCsvFiles(storedFiles);
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setUploadMessage("Please select a file.");
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContent = event.target?.result as string;
                const filename = selectedFile.name;

                // Extract X from filename
                const match = filename.match(/user_orders-(\d+)\.csv/);
                const xNumber = match ? match[1] : "unknown";

                // Add datetime stamp
                const now = new Date();
                const timestamp = now.toISOString().replace(/[-:]/g, '').slice(0, 15); // YYYYMMDDTHHMMSS
                const newFilename = `user_orders-${xNumber}-${timestamp}.csv`;

                // Save to local storage
                localStorage.setItem(newFilename, fileContent);
                setCsvFiles((prevFiles) => [...prevFiles, newFilename]); // Add the new file to the list
                setUploadMessage(`File "${newFilename}" uploaded and saved to local storage.`);
            };

            reader.onerror = () => {
                setUploadMessage("Error reading file.");
            };

            reader.readAsText(selectedFile);
        } catch (error:any) {
            console.error("Upload error:", error);
            setUploadMessage(`Upload failed: ${error.message}`);
        }
    };
    const handleShowStatistics = (filename: string) => {
        router.push(`/eats/${filename}`);
    };

    return (
        <div className="container mx-auto p-4">


            <div className="mb-4">
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                    Upload User Orders CSV:
                </label>
                <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "
                />
            </div>

            <button
                onClick={handleFileUpload}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={!selectedFile}
            >
                Upload File
            </button>

            {uploadMessage && <p className="mt-4">{uploadMessage}</p>}
            {csvFiles.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mt-4">Available CSV Files:</h2>
                    <ul>
                        {csvFiles.map((filename) => {
                            const dateMatch = filename.match(/(\d{8}T\d{6})/);
                            let formattedDate = filename;

                            if (dateMatch) {
                                const timestamp = dateMatch[1];
                                const year = timestamp.slice(0, 4);
                                const month = timestamp.slice(4, 6);
                                const day = timestamp.slice(6, 8);
                                const hour = timestamp.slice(9, 11);
                                const minute = timestamp.slice(11, 13);
                                const second = timestamp.slice(13, 15);

                                const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
                                formattedDate = date.toLocaleString();
                            }

                            return (
                                <li key={filename} className="flex items-center justify-between py-2 border-b">
                                    <span>{formattedDate}</span>
                                    <button
                                        onClick={() => handleShowStatistics(filename)}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs"
                                    >
                                        Show Statistics
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
