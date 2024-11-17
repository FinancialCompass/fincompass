// components/plaid/SpendingChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/types';

interface SpendingChartProps {
    transactions: Transaction[];
}

export const SpendingChart = ({ transactions }: SpendingChartProps) => {
    const spendingByDate = transactions.reduce((acc: { [key: string]: number }, transaction) => {
        const date = transaction.date;
        acc[date] = (acc[date] || 0) + transaction.amount;
        return acc;
    }, {});

    const chartData = Object.entries(spendingByDate)
        .map(([date, amount]) => ({
            date,
            amount: Number(amount.toFixed(2))
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <Card>
            <CardHeader>
                <CardTitle>Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#2563eb"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};