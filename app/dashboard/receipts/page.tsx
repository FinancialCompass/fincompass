<<<<<<< HEAD
'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/receipts/FileUpload';
import ReceiptDashboard from '@/components/receipts/ReceiptDashboard';
import { Receipt } from '@/types';

interface PinataFile {
    id: string;
    name: string;
    cid: string;
    size: number;
    number_of_files: number;
    mime_type: string;
    group_id: string;
    keyvalues: Record<string, any>;
    created_at: string;
    url: string;
}

type ItemCategory = "DESSERT" | "PRODUCE" | "OTHER" | "GROCERY" | "BEVERAGE" | "PREPARED_FOOD";

interface Transaction {
    subtotal: number;
    tax: number | null;
    tip: number | null;  // Added the required tip property
    total: number;
    payment_method: {
        type: string;
        entry_method: string;
        card_type?: string;
    };
}

interface ReceiptTemplate {
    merchant_name: string;
    merchant_address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    merchant_phone: string;
    summary: string;
    transaction: Transaction;  // Using the Transaction interface
    items: Array<{
        name: string;
        quantity: number;
        unit_price: number;
        total_price: number;
        category: ItemCategory;
    }>;
}

// Sample data with proper transaction typing including tip
const sampleReceiptData: ReceiptTemplate[] = [
    {
        merchant_name: "Sprouts Farmers Market",
        merchant_address: {
            street: "3030 Harbor Blvd. #D",
            city: "Costa Mesa",
            state: "CA",
            zip: "92626"
        },
        merchant_phone: "(714)751-6399",
        summary: "Grocery purchase at Sprouts with fresh produce",
        transaction: {
            subtotal: 17.87,
            tax: 1.45,
            tip: null,  // Added tip field even if null
            total: 19.32,
            payment_method: {
                type: "DEBIT",
                entry_method: "CHIP"
            }
        },
        items: [
            {
                name: "HASS AVOCADOS",
                quantity: 6,
                unit_price: 0.33,
                total_price: 2.00,
                category: "PRODUCE"
            },
            {
                name: "ROMA TOMATOES",
                quantity: 4,
                unit_price: 0.12,
                total_price: 0.48,
                category: "PRODUCE"
            }
        ]
    },
    {
        merchant_name: "Main Street Restaurant",
        merchant_address: {
            street: "6332 Business Drive",
            city: "Palo Alto",
            state: "CA",
            zip: "94301"
        },
        merchant_phone: "575-1628095",
        summary: "Lunch at Main Street Restaurant",
        transaction: {
            subtotal: 25.23,
            tax: 2.15,
            tip: 3.78,  // Example with a tip
            total: 31.16,
            payment_method: {
                type: "CREDIT",
                entry_method: "SWIPE",
                card_type: "DISCOVER"
            }
        },
        items: []
    }
];

const ReceiptPage = () => {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Simulated OCR processing with proper typing
    const simulateOCR = (file: PinataFile): Receipt => {
        // Get random sample data
        const sampleData = sampleReceiptData[Math.floor(Math.random() * sampleReceiptData.length)];

        return {
            summary: sampleData.summary,
            metadata: {
                merchant_name: sampleData.merchant_name,
                merchant_address: sampleData.merchant_address,
                merchant_phone: sampleData.merchant_phone,
                date: new Date(file.created_at).toISOString().split('T')[0],
                time: new Date(file.created_at).toTimeString().split(' ')[0],
                receipt_id: file.id
            },
            transaction: sampleData.transaction,  // Now properly typed with tip field
            items: sampleData.items,
            status: "PROCESSED",
            created_at: file.created_at,
            updated_at: file.created_at,
            image_url: file.url
        };
    };

    const fetchReceipts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/files/retrieve');
            if (!response.ok) {
                throw new Error('Failed to fetch receipts');
            }

            const pinataFiles: PinataFile[] = await response.json();
            const processedReceipts = pinataFiles.map(simulateOCR);

            setReceipts(processedReceipts);
        } catch (err) {
            console.error('Error fetching receipts:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch receipts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReceipts();
    }, []);

    const handleUploadSuccess = async () => {
        await fetchReceipts();
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Receipt Scanner</h1>
                <p className="text-gray-500">
                    Upload your receipts to track expenses and get instant analysis
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upload Receipts</CardTitle>
                    <CardDescription>
                        Drop your receipt images or click to browse
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FileUpload onUploadSuccess={handleUploadSuccess} />
                </CardContent>
            </Card>

            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Receipt Analysis</CardTitle>
                        <CardDescription>
                            Track your spending and view receipt details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Processing your receipts...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-500">{error}</p>
                                <button
                                    onClick={fetchReceipts}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <ReceiptDashboard receipts={receipts} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReceiptPage;
=======
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { PinataSDK } from "pinata";



ChartJS.register(ArcElement, Tooltip, Legend);
export default function DashboardPage() {
    const [receipts, setReceipts] = useState<
        { id: number; store_name: string; date: string; subtotal: number; items: { name: string; price: number; category: string}[] }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [selectedReceipt, setSelectedReceipt] = useState<null | typeof receipts[0]>(null);

    // Handle file input state
    const [file, setFile] = useState<File | null>(null);
    const [responseMessage, setResponseMessage] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const pinata = new PinataSDK({
        pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiN2U2ZDU0YS1lMmVmLTRhN2QtYWJmOC1lNGI1ZmU1NmEzMmEiLCJlbWFpbCI6ImFuZHJld2RtaXQyMDIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5ZTI4MWQ4MTU5MmFkMzlmZjA5ZCIsInNjb3BlZEtleVNlY3JldCI6ImNlODE1OTczNDM4Zjg0M2U0MGVmZjg0NGRkN2YwOGRkYjJlNWI4MTQ2ZTRhM2Q3YjdmZWNkYjRmZDFlMmRkZGQiLCJleHAiOjE3NjMzOTAwMzl9.QkhhlGlwk23pS_DfTZ45lUnqhZIG5E87dXjA8uemZ3E",
        pinataGateway: "white-bizarre-opossum-706.mypinata.cloud",
      });

    // Fetch receipts from the API
    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/checks/");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setReceipts(data);
            } catch (error) {
                console.error("Failed to fetch receipts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReceipts();
    }, []);

    // Handle file input change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        setFile(selectedFile);

        // Preview the selected image
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setImagePreview(null);
        }
    };

    // Handle drag over event
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = "copy";
    };
    const calculateTotalCostForAllReceipts = (receipts: { items: { name: string; price: string | number; category: string }[] }[]) => {
        return receipts.reduce((total, receipt) => {
            const receiptTotal = receipt.items.reduce((sum, item) => sum + Number(item.price), 0);
            return total + receiptTotal;
        }, 0);
    };

    // Handle drop event
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const droppedFile = event.dataTransfer.files[0];
        setFile(droppedFile);

        // Preview the dropped image
        if (droppedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(droppedFile);
        }
    };

    // Handle form submission
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!file) {
            setResponseMessage("Please select a file to upload.");
            return;
        }

        setResponseMessage("Processing...");
        const upload = await pinata.upload.file(file);
        console.log(upload.cid);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/receipts/process_receipt/`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            // Update the list of receipts after successful upload
            const updatedReceipts = await fetch("http://127.0.0.1:8000/api/checks/");
            const updatedData = await updatedReceipts.json();
            setReceipts(updatedData);

            setResponseMessage("Receipt processed successfully.");
            setImagePreview(null); // Remove the preview image after processing
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Close the modal
    const closeModal = () => setSelectedReceipt(null);

    const getCategoryData = (items: { name: string; price: number; category: string }[]) => {
        const categoryCounts: { [key: string]: number } = {};
    
        items.forEach(item => {
            if (categoryCounts[item.category]) {
                categoryCounts[item.category] += 1; // Increment count for each item in the category
            } else {
                categoryCounts[item.category] = 1; // Initialize count to 1 for the first item in the category
            }
        });
    
        return categoryCounts;
    };

    // Create pie chart data from category counts
    const createPieChartData = (categoryCounts: { [key: string]: number }) => {
        // If only one category exists, use a single color
        const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFC300"];
        const pieColors =
            Object.keys(categoryCounts).length === 1
                ? ["#FF5733"] // Use one color if only one category exists
                : colors.slice(0, Object.keys(categoryCounts).length);

        return {
            labels: Object.keys(categoryCounts),
            datasets: [
                {
                    data: Object.values(categoryCounts),
                    backgroundColor: pieColors,
                    hoverBackgroundColor: pieColors.map((color) => color.replace("FF", "CC")), // Slightly darker colors for hover
                },
            ],
        };
    };


    return (
        <div className="flex flex-col gap-6">
            {/* Upload Receipt Section */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Receipt Upload</h1>
                <p className="text-muted-foreground">
                    Upload your receipt image to analyze its details.
                </p>
                <form onSubmit={handleFormSubmit} className="mt-4">
                    <div
                        className="upload-container border-2 border-dashed border-gray-300 p-4 text-center mb-4"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <p>Select or drag-and-drop a receipt image to analyze</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border p-2 rounded w-full mb-4"
                            required
                            style={{ display: "none" }}
                            id="fileInput" // Add this id to connect with label
                        />
                        <label
                            htmlFor="fileInput" // This should match the input's id
                            className="inline-block bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
                        >
                            Select a file
                        </label>
                    </div>

                    {imagePreview && (
                        <img
                            id="preview"
                            src={imagePreview}
                            alt="Receipt Preview"
                            className="max-w-[300px] mx-auto mb-4"
                        />
                    )}

                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full"
                    >
                        Process Receipt
                    </button>
                </form>

                <div
                    id="response"
                    className="mt-4 p-4 border border-gray-300 rounded bg-gray-100"
                >
                    {responseMessage}
                </div>
            </div>

            {/* Display Receipts Section */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Your Receipts</h2>
                <h2>Total spent: <span className="text-red-500">${calculateTotalCostForAllReceipts(receipts).toFixed(2)}</span></h2>
                <p className="text-muted-foreground">Browse through your uploaded receipts.</p>
                {loading ? (
                    <p className="text-center text-gray-500">Loading receipts...</p>
                ) : (
                    <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                        {receipts.map((receipt) => {
                            const categoryCounts = getCategoryData(receipt.items);
                            const pieChartData = createPieChartData(categoryCounts);
                            console.log(pieChartData);
                            return (
                                <Card
                                    key={receipt.id}
                                    className="cursor-pointer flex flex-col md:flex-row gap-4"
                                >
                                    {/* Left Side: Receipt Information */}
                                    <div className="flex flex-col w-full md:w-2/3">
                                        <CardHeader>
                                            <CardTitle onClick={() => setSelectedReceipt(receipt)}>{receipt.store_name}</CardTitle>
                                            <CardDescription>{receipt.date}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 font-medium">
                                                Total: ${receipt.subtotal}
                                            </p>
                                        </CardContent>
                                    </div>


                                    <div className="flex justify-center items-center w-full md:w-1/3 overflow-auto max-h-96">
                                        <Pie data={pieChartData} />
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Custom Modal for Receipt Details */}
            {selectedReceipt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-semibold mb-4">Receipt Details</h2>
                        <p>
                            <strong>Store Name:</strong> {selectedReceipt.store_name}
                        </p>
                        <p>
                            <strong>Date:</strong> {selectedReceipt.date}
                        </p>
                        <p>
                            <strong>Total:</strong> ${selectedReceipt.subtotal}
                        </p>
                        <div className="overflow-x-auto overflow-y-auto mt-2 max-h-80">
                            <table className="table-auto w-full border-collapse border border-gray-300 overflow-y-auto">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                                        <th className="border border-gray-300 px-4 py-2 text-right">Price ($)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedReceipt.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                                            <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-right">{item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button
                            className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
>>>>>>> 38149151b34c97f3266f13a1d9b2c6ce5a02cba6
