import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface FinancialDashboardProps {
    accessToken: string;
}

const FinancialDashboard = ({ accessToken }: FinancialDashboardProps) => {
    interface Account {
        account_id: string;
        name: string;
        type: string;
        subtype: string;
        balances: {
            current: number;
        };
    }

    const [accounts, setAccounts] = useState<Account[]>([]);
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

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch accounts
                const accountsResponse = await fetch('/api/plaid/get-accounts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token: accessToken }),
                });
                const accountsData = await accountsResponse.json();
                setAccounts(accountsData.accounts || []);

                // Fetch transactions
                const transactionsResponse = await fetch('/api/plaid/get-transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token: accessToken }),
                });
                const transactionsData = await transactionsResponse.json();
                setTransactions(transactionsData.transactions || []);
            } catch (err) {
                setError('Failed to fetch financial data');
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchData();
        }
    }, [accessToken]);

    // Calculate total balances
    const totalBalance = accounts.reduce((sum, account) =>
        sum + (account.balances.current || 0), 0
    );

    // Prepare data for spending chart
    const spendingByDate = transactions.reduce((acc: { [key: string]: number }, transaction) => {
        const date = transaction.date;
        acc[date] = (acc[date] || 0) + transaction.amount;
        return acc;
    }, {});

    const chartData = Object.entries(spendingByDate).map(([date, amount]) => ({
        date,
        amount: Number(amount.toFixed(2))
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (loading) {
        return <div className="p-4">Loading financial data...</div>;
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Account Summary */}
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
                        <p className="text-2xl font-bold">{accounts.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{transactions.length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Spending Chart */}
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

            {/* Accounts List */}
            <Card>
                <CardHeader>
                    <CardTitle>Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Account Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Subtype</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts.map((account) => (
                                <TableRow key={account.account_id}>
                                    <TableCell className="font-medium">{account.name}</TableCell>
                                    <TableCell>{account.type}</TableCell>
                                    <TableCell>{account.subtype}</TableCell>
                                    <TableCell className="text-right">
                                        ${account.balances.current?.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.slice(0, 10).map((transaction) => (
                                <TableRow key={transaction.transaction_id}>
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell className="font-medium">
                                        {transaction.merchant_name || transaction.name}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.personal_finance_category?.primary}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ${Math.abs(transaction.amount).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default FinancialDashboard;