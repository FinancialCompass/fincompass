// components/plaid/AccountSummary.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AccountSummaryProps {
    totalBalance: number;
    accountCount: number;
    transactionCount: number;
}

export const AccountSummary = ({ totalBalance, accountCount, transactionCount }: AccountSummaryProps) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
            <CardHeader>
                <CardTitle>Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">${totalBalance.toFixed(2)}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Total Accounts</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{accountCount}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{transactionCount}</p>
            </CardContent>
        </Card>
    </div>
);