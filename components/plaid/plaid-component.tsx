'use client'

import { useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FinancialDashboard from './financial-dashboard'; // Adjust the import path as needed

const PlaidLinkComponent = () => {
    const [linkToken, setLinkToken] = useState(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [showDashboard, setShowDashboard] = useState(false);

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
            setShowDashboard(true); // Show dashboard after successful connection
        } catch (err) {
            setError('Failed to exchange token');
        }
    };

    const { open } = usePlaidLink({
        token: linkToken,
        onSuccess,
    });

    // If we have an access token and showDashboard is true, show the dashboard
    if (showDashboard && accessToken) {
        return <FinancialDashboard accessToken={accessToken} />;
    }

    // Otherwise show the Plaid Link UI
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

                {accessToken && !showDashboard && (
                    <div className="space-y-4 mt-4">
                        <Alert>
                            <AlertDescription>
                                Successfully connected! Access token: {accessToken.slice(0, 10)}...
                            </AlertDescription>
                        </Alert>
                        <Button
                            onClick={() => setShowDashboard(true)}
                            className="w-full"
                        >
                            View Financial Dashboard
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PlaidLinkComponent;