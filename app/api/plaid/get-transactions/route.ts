import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid/plaid';

export async function POST(request: Request) {
    try {
        const { access_token } = await request.json();
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const response = await plaidClient.transactionsGet({
            access_token,
            start_date: thirtyDaysAgo.toISOString().split('T')[0],
            end_date: now.toISOString().split('T')[0],
            options: {
                include_personal_finance_category: true,
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}