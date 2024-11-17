import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock, DollarSign, ShoppingBag, Tag, Calendar, MapPin, Phone, CreditCard, Receipt as ReceiptIcon, Image as ImageIcon } from 'lucide-react';
import { Receipt } from '@/types';

interface DashboardProps {
    receipts: Receipt[];
}

interface TimelineGroupProps {
    date: string;
    receipts: Receipt[];
}

// Status Badge Component
const StatusBadge: React.FC<{ status: Receipt['status'] }> = ({ status }) => {
    const statusStyles = {
        PROCESSED: "bg-green-100 text-green-800",
        PENDING: "bg-yellow-100 text-yellow-800",
        ERROR: "bg-red-100 text-red-800"
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[status || 'PENDING']}`}>
            {status || 'PENDING'}
        </span>
    );
};

// Receipt Card Component
const ReceiptCard: React.FC<{ receipt: Receipt }> = ({ receipt }) => {
    const { metadata, transaction, items, summary, status, image_url } = receipt;

    return (
        <Card className="mb-4 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex gap-4">
                    {/* Receipt Image Section */}
                    <div className="w-48 h-48 flex-shrink-0">
                        {image_url ? (
                            <img
                                src={image_url}
                                alt={`Receipt from ${metadata.merchant_name}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                <ImageIcon className="w-12 h-12 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Receipt Details Section */}
                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        {metadata.merchant_name}
                                    </h3>
                                    <StatusBadge status={status} />
                                </div>
                                <p className="text-sm text-gray-600">{summary}</p>
                                <div className="text-xs text-gray-500 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3" />
                                        {`${metadata.merchant_address.street}, ${metadata.merchant_address.city}`}
                                    </div>
                                    {metadata.merchant_phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-3 h-3" />
                                            {metadata.merchant_phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(metadata.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {metadata.time}
                            </div>
                            <div className="flex items-center gap-1">
                                <CreditCard className="w-4 h-4" />
                                {transaction.payment_method.type}
                            </div>
                            <div className="flex items-center gap-1">
                                <Tag className="w-4 h-4" />
                                {items.length} items
                            </div>
                        </div>

                        <div className="flex justify-between border-t pt-4">
                            <div className="space-y-1">
                                <div className="text-sm text-gray-600">Subtotal: ${transaction.subtotal.toFixed(2)}</div>
                                {transaction.tax && <div className="text-sm text-gray-600">Tax: ${transaction.tax.toFixed(2)}</div>}
                                {transaction.tip && <div className="text-sm text-gray-600">Tip: ${transaction.tip.toFixed(2)}</div>}
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                                ${transaction.total.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Quick Stats Component
const QuickStats: React.FC<DashboardProps> = ({ receipts }) => {
    const getTotalSpent = () =>
        receipts.reduce((sum, r) => sum + r.transaction.total, 0);

    const getTopMerchant = () => {
        const merchants = receipts.reduce((acc, r) => {
            acc[r.metadata.merchant_name] = (acc[r.metadata.merchant_name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(merchants).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
    };

    const getProcessedCount = () =>
        receipts.filter(r => r.status === 'PROCESSED').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Spent</p>
                            <h3 className="text-2xl font-bold">${getTotalSpent().toFixed(2)}</h3>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Receipts</p>
                            <h3 className="text-2xl font-bold">{receipts.length}</h3>
                        </div>
                        <ReceiptIcon className="w-8 h-8 text-blue-500" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Processed</p>
                            <h3 className="text-2xl font-bold">{getProcessedCount()}</h3>
                        </div>
                        <ShoppingBag className="w-8 h-8 text-purple-500" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Top Merchant</p>
                            <h3 className="text-lg font-bold truncate">{getTopMerchant()}</h3>
                        </div>
                        <Tag className="w-8 h-8 text-orange-500" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Timeline Group Component
const TimelineGroup: React.FC<TimelineGroupProps> = ({ date, receipts }) => {
    const totalForDay = receipts.reduce((sum, r) => sum + r.transaction.total, 0);

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <h2 className="text-lg font-semibold text-gray-700">
                        {new Date(date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h2>
                </div>
                <span className="text-sm font-medium text-gray-600">
                    Daily Total: ${totalForDay.toFixed(2)}
                </span>
            </div>
            <div className="space-y-4">
                {receipts.map((receipt) => (
                    <ReceiptCard
                        key={receipt.metadata.receipt_id}
                        receipt={receipt}
                    />
                ))}
            </div>
        </div>
    );
};

const ReceiptDashboard: React.FC<DashboardProps> = ({ receipts }) => {
    // Filter out receipts without images if needed
    const receiptsWithImages = receipts.filter(receipt => receipt.image_url);

    const groupReceiptsByDate = () => {
        const groups = receiptsWithImages.reduce((acc, receipt) => {
            const date = receipt.metadata.date;
            if (!acc[date]) acc[date] = [];
            acc[date].push(receipt);
            return acc;
        }, {} as Record<string, Receipt[]>);

        return Object.entries(groups)
            .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime());
    };

    if (receiptsWithImages.length === 0) {
        return (
            <div className="text-center py-12">
                <ImageIcon className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No receipts found</h3>
                <p className="text-gray-500">Upload some receipts to get started</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <QuickStats receipts={receiptsWithImages} />
            <div className="mb-8">
                {groupReceiptsByDate().map(([date, dateReceipts]) => (
                    <TimelineGroup
                        key={date}
                        date={date}
                        receipts={dateReceipts}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReceiptDashboard;