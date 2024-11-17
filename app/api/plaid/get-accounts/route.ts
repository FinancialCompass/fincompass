import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid/plaid';

export async function POST(request: Request) {
    try {
        const { access_token } = await request.json();
        const response = await plaidClient.accountsGet({
            access_token,
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch accounts' },
            { status: 500 }
        );
    }
}