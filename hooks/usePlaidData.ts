import { useState, useEffect } from 'react';

interface Account {
    account_id: string;
    name: string;
    type: string;
    subtype: string;
    balances: {
        current: number;
    };
}

interface Transaction {
    transaction_id: string;
    date: string;
    amount: number;
    name: string;
    merchant_name?: string;
    personal_finance_category?: {
        primary: string;
    };
}

interface PlaidData {
    accounts: Account[];
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    totalBalance: number;
    refetch: () => Promise<void>;
}

export const usePlaidData = (accessToken: string): PlaidData => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [accountsData, transactionsData] = await Promise.all([
                fetch('/api/plaid/get-accounts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token: accessToken }),
                }).then(res => res.json()),

                fetch('/api/plaid/get-transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token: accessToken }),
                }).then(res => res.json())
            ]);

            setAccounts(accountsData.accounts || []);
            setTransactions(transactionsData.transactions || []);
        } catch (err) {
            setError('Failed to fetch financial data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchData();
        }
    }, [accessToken]);

    const totalBalance = accounts.reduce(
        (sum, account) => sum + (account.balances.current || 0),
        0
    );

    return {
        accounts,
        transactions,
        loading,
        error,
        totalBalance,
        refetch: fetchData
    };
};