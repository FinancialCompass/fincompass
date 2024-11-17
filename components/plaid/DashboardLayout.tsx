'use client'

import { usePlaidStore } from '@/store/plaid-store';
import FinancialDashboard from './FinancialDashboard';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { accessToken } = usePlaidStore();
    const pathname = usePathname();

    // Only show dashboard on the accounts page
    const showDashboard = pathname === '/dashboard/accounts' && accessToken;

    return (
        <div className="flex-1 overflow-auto">
            <div className="p-6">
                {children}
                {showDashboard && (
                    <div className="mt-6">
                        <FinancialDashboard accessToken={accessToken} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardLayout;