import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PlaidTransaction {
    transaction_id: string;
    date: string;
    merchant_name?: string;
    name: string;
    amount: number;
    personal_finance_category?: {
        primary: string;
    };
}

interface TransactionsListProps {
    transactions: PlaidTransaction[];
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => (
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
);
