import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid/plaid';
import { CountryCode, Products } from 'plaid';

export async function POST() {
    try {
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: 'test-user-id' },
            client_name: 'Financial Compass',
            products: [Products.Transactions],
            country_codes: [CountryCode.Us],
            language: 'en',
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error creating link token:', error);
        return NextResponse.json(
            { error: 'Failed to create link token' },
            { status: 500 }
        );
    }
}