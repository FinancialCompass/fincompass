'use client'

import { useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FinancialDashboard from './FinancialDashboard';
import { usePlaidStore } from '@/store/plaid-store';
import { Building2, ArrowRight, AlertCircle } from 'lucide-react';

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
        <Card className="w-full max-w-xl mx-auto bg-white shadow-lg">
            <CardHeader className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <CardTitle className="text-xl font-semibold">Connect Your Bank Account</CardTitle>
                </div>
                <CardDescription className="text-gray-500">
                    Securely connect your bank account to track your finances in real-time
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-600 ml-2">{error}</AlertDescription>
                    </Alert>
                )}

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-600 font-medium">1</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Secure Connection</h3>
                            <p className="text-sm text-gray-500">Your data is encrypted and never stored on our servers</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-600 font-medium">2</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Real-time Sync</h3>
                            <p className="text-sm text-gray-500">Automatically import and categorize your transactions</p>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={() => {
                        if (!linkToken) {
                            createLinkToken();
                        } else {
                            open();
                        }
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 h-11"
                >
                    {linkToken ? "Launch Secure Connection" : "Connect Your Bank Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-center text-gray-500">
                    Protected by bank-level security. We use Plaid to securely connect your accounts.
                </p>
            </CardContent>
        </Card>
    );
};

export default PlaidLinkComponent;