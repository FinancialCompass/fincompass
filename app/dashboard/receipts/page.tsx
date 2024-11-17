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