import { createContext, useContext, ReactNode } from 'react';
import { usePlaidData } from '../hooks/usePlaidData';

const PlaidContext = createContext<ReturnType<typeof usePlaidData> | null>(null);

export const PlaidProvider = ({ children, accessToken }: { children: ReactNode; accessToken: string }) => {
    const plaidData = usePlaidData(accessToken);
    return <PlaidContext.Provider value={plaidData}>{children}</PlaidContext.Provider>;
};

export const usePlaid = () => {
    const context = useContext(PlaidContext);
    if (!context) throw new Error('usePlaid must be used within PlaidProvider');
    return context;
};