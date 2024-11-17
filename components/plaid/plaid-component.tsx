'use client'

import { useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FinancialDashboard from './FinancialDashboard';
import { usePlaidStore } from '@/store/plaid-store';

const PlaidLinkComponent = () => {
    const [linkToken, setLinkToken] = useState(null);
    const [error, setError] = useState('');
    const { accessToken, setAccessToken } = usePlaidStore();

    const createLinkToken = async () => {
        try {
            const response = await fetch('/api/plaid/create-link-token', {
                method: 'POST',
            });
            const data = await response.json();
            setLinkToken(data.link_token);
        } catch (err) {
            setError('Failed to create link token');
        }
    };

    const onSuccess = async (public_token: string) => {
        try {
            const response = await fetch('/api/plaid/exchange-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ public_token }),
            });
            const data = await response.json();
            setAccessToken(data.access_token);
        } catch (err) {
            setError('Failed to exchange token');
        }
    };

    const { open } = usePlaidLink({
        token: linkToken,
        onSuccess,
    });

    // If we have an access token, show the dashboard
    if (accessToken) {
        return <FinancialDashboard accessToken={accessToken} />;
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Connect Your Bank Account</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {!linkToken ? (
                    <Button
                        onClick={createLinkToken}
                        className="w-full"
                    >
                        Connect Bank Account
                    </Button>
                ) : (
                    <Button
                        onClick={() => open()}
                        className="w-full"
                    >
                        Launch Plaid Link
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default PlaidLinkComponent;