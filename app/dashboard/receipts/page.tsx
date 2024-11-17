import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/receipts/FileUpload';

const ReceiptPage = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight ">Upload Receipt</h1>
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
        </div>
    );
};

export default ReceiptPage;