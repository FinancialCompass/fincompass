// components/plaid/AccountsList.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Account } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface AccountsListProps {
    accounts: Account[];
}

const getAccountTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
        depository: 'bg-blue-100 text-blue-800',
        credit: 'bg-purple-100 text-purple-800',
        loan: 'bg-yellow-100 text-yellow-800',
        investment: 'bg-green-100 text-green-800',
        brokerage: 'bg-indigo-100 text-indigo-800',
    };
    return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

export const AccountsList = ({ accounts }: AccountsListProps) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Connected Accounts</CardTitle>
                    <Badge variant="outline">{accounts.length} Total</Badge>
                </div>
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
                                <TableCell className="font-medium">
                                    {account.name}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={getAccountTypeColor(account.type)}
                                    >
                                        {account.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {account.subtype}
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className={account.balances.current >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {formatCurrency(account.balances.current)}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};