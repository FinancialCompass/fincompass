// components/plaid/FinancialDashboard.tsx
'use client';

import { useEffect } from 'react';
import { AccountSummary } from './AccountSummary';
import { SpendingChart } from './SpendingChart';
import { AccountsList } from './AccountsList';
import { TransactionsList } from './TransactionsList';
import { usePlaidStore } from '@/store/plaid-store';
import { usePlaidData } from '@/hooks/usePlaidData';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FinancialDashboardProps {
    accessToken: string;
}

const FinancialDashboard = ({ accessToken }: FinancialDashboardProps) => {
    const { accounts, transactions, loading, error, totalBalance } = usePlaidData(accessToken);

    if (loading) return <div className="p-4">Loading financial data...</div>;
    if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

    return (
        <div className="space-y-6 p-6">
            <AccountSummary
                totalBalance={totalBalance}
                accountCount={accounts.length}
                transactionCount={transactions.length}
            />
            <SpendingChart transactions={transactions} />
            <AccountsList accounts={accounts} />
            <TransactionsList transactions={transactions} />
        </div>
    );
};

export default FinancialDashboard;