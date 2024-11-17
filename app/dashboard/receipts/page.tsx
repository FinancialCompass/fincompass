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

// Sample receipt data
const sampleReceipts: Receipt[] = [
    {
        summary: "Grocery purchase at Sprouts with fresh produce",
        metadata: {
            merchant_name: "Sprouts Farmers Market",
            merchant_address: {
                street: "3030 Harbor Blvd. #D",
                city: "Costa Mesa",
                state: "CA",
                zip: "92626"
            },
            merchant_phone: "(714)751-6399",
            date: "2018-05-05",
            time: "15:41",
            receipt_id: "584472"
        },
        transaction: {
            subtotal: 17.87,
            tax: 1.45,
            tip: null,
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
        ],
        status: "PROCESSED",
        created_at: "2024-11-17T14:20:55.879Z",
        updated_at: "2024-11-17T14:20:55.879Z"
    },
    {
        summary: "Lunch at Main Street Restaurant",
        metadata: {
            merchant_name: "Main Street Restaurant",
            merchant_address: {
                street: "6332 Business Drive",
                city: "Palo Alto",
                state: "CA",
                zip: "94301"
            },
            merchant_phone: "575-1628095",
            date: "2017-04-07",
            time: "11:36",
            receipt_id: "819543"
        },
        transaction: {
            subtotal: 25.23,
            tax: null,
            tip: 3.78,
            total: 29.01,
            payment_method: {
                type: "CREDIT",
                entry_method: "SWIPE",
                card_type: "DISCOVER"
            }
        },
        items: [],
        status: "PROCESSED",
        created_at: "2024-11-17T13:43:05.063Z",
        updated_at: "2024-11-17T13:43:05.063Z"
    },
    {
        summary: "Desserts from Main Street Restaurant",
        metadata: {
            merchant_name: "Main Street Restaurant",
            merchant_address: {
                street: "6332 Business Drive",
                city: "Palo Alto",
                state: "CA",
                zip: "94301"
            },
            merchant_phone: "575-1628095",
            date: "2017-04-07",
            time: "14:47",
            receipt_id: "826425"
        },
        transaction: {
            subtotal: 12.00,
            tax: null,
            tip: 2.16,
            total: 14.16,
            payment_method: {
                type: "CREDIT",
                entry_method: "SWIPE",
                card_type: "DISCOVER"
            }
        },
        items: [
            {
                name: "Chocolate Chip Cookie",
                quantity: 1,
                unit_price: 5.00,
                total_price: 5.00,
                category: "DESSERT"
            },
            {
                name: "Apple Pie",
                quantity: 1,
                unit_price: 3.00,
                total_price: 3.00,
                category: "DESSERT"
            },
            {
                name: "Lava Cake",
                quantity: 1,
                unit_price: 4.00,
                total_price: 4.00,
                category: "DESSERT"
            }
        ],
        status: "PROCESSED",
        created_at: "2024-11-17T13:43:05.951Z",
        updated_at: "2024-11-17T13:43:05.951Z"
    }
];

const ReceiptPage = () => {
    const [receipts, setReceipts] = useState<PinataFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReceipts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/files/retrieve');
            if (!response.ok) {
                throw new Error('Failed to fetch receipts');
            }
            const data = await response.json();
            setReceipts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch receipts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReceipts();
    }, []);

    const handleUploadSuccess = () => {
        fetchReceipts();
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Upload Receipt</h1>
                <p className="text-gray-500">
                    Upload your receipt to track expenses and get insights
                </p>
            </div>

            {/* Main Upload Section */}
            <Card>
                <CardHeader className="flex flex-col items-center justify-center text-center">
                    <CardTitle>Receipt Scanner</CardTitle>
                    <CardDescription>
                        Take a photo or upload an image of your receipt
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FileUpload />
                </CardContent>
            </Card>

            {/* Receipts Image Gallery */}
            {loading ? (
                <div className="text-center py-8">Loading receipts...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Uploaded Images</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {receipts.map((receipt) => (
                            <Card key={receipt.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                    <img
                                        src={receipt.url}
                                        alt={receipt.name}
                                        className="w-full h-48 object-cover rounded-md mb-4"
                                    />
                                    <h3 className="font-semibold">{receipt.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        Uploaded: {new Date(receipt.created_at).toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Sample Receipt Dashboard */}
            <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-4">Receipt Analysis Dashboard</h2>
                <ReceiptDashboard receipts={sampleReceipts} />
            </div>
        </div>
    );
};

export default ReceiptPage;