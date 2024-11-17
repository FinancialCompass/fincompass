'use client'

import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const receipts = [
    {
        id: 1,
        store: "Walmart",
        date: "2024-03-15",
        amount: 156.78,
        category: "Groceries",
        trend: [
            { value: 130 },
            { value: 140 },
            { value: 156.78 }
        ]
    },
    {
        id: 2,
        store: "Target",
        date: "2024-03-14",
        amount: 89.99,
        category: "Home",
        trend: [
            { value: 95 },
            { value: 85 },
            { value: 89.99 }
        ]
    },
    {
        id: 3,
        store: "Amazon",
        date: "2024-03-13",
        amount: 245.50,
        category: "Electronics",
        trend: [
            { value: 200 },
            { value: 220 },
            { value: 245.50 }
        ]
    },
    {
        id: 4,
        store: "Costco",
        date: "2024-03-12",
        amount: 312.45,
        category: "Groceries",
        trend: [
            { value: 300 },
            { value: 305 },
            { value: 312.45 }
        ]
    },
    {
        id: 5,
        store: "Home Depot",
        date: "2024-03-11",
        amount: 178.23,
        category: "Home",
        trend: [
            { value: 185 },
            { value: 175 },
            { value: 178.23 }
        ]
    }
]

const categoryColors = {
    Groceries: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    Home: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
    Electronics: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
}

// Helper function to format dates consistently
function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

export function RecentReceipts() {
    return (
        <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
                {receipts.map((receipt) => (
                    <div
                        key={receipt.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                        <div className="space-y-1">
                            <p className="font-medium">{receipt.store}</p>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="secondary"
                                    className={categoryColors[receipt.category as keyof typeof categoryColors]}
                                >
                                    {receipt.category}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    {formatDate(receipt.date)}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-[100px] h-[40px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={receipt.trend}>
                                        <defs>
                                            <linearGradient id={`gradient-${receipt.id}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2} />
                                                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="hsl(var(--chart-1))"
                                            fill={`url(#gradient-${receipt.id})`}
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="font-medium tabular-nums">
                                ${receipt.amount.toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}