import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid/plaid';

export async function POST(request: Request) {
    try {
        const { public_token } = await request.json();

        const response = await plaidClient.itemPublicTokenExchange({
            public_token: public_token
        });

        const accessToken = response.data.access_token;

        return NextResponse.json({ access_token: accessToken });
    } catch (error) {
        console.error('Error exchanging public token:', error);
        return NextResponse.json(
            { error: 'Failed to exchange token' },
            { status: 500 }
        );
    }
}