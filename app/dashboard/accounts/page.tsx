'use client';

import { usePlaidStore } from '@/store/plaid-store';
import PlaidLinkComponent from '@/components/plaid/PlaidLink';
import FinancialDashboard from '@/components/plaid/FinancialDashboard';

export default function AccountsPage() {
    const { accessToken } = usePlaidStore();

    return (
        <div>
            {!accessToken ? (
                <PlaidLinkComponent />
            ) : (
                <FinancialDashboard accessToken={accessToken} />
            )}
        </div>
    );
}