'use client'

import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Receipt,
    CreditCard,
    Settings,
    ChevronLeft,
    LogOut,
    Menu,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard
    },
    {
        name: "Receipts",
        href: "/dashboard/receipts",
        icon: Receipt
    },
    {
        name: "Accounts",
        href: "/dashboard/accounts",
        icon: CreditCard
    },
    {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings
    }
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <Image
                        src="/icons/logo1.png"
                        alt="Financial Compass Logo"
                        width={50}
                        height={50}
                    />
                </div>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            <div className="flex h-screen lg:h-[calc(100vh-0px)] overflow-hidden">
                {/* Sidebar */}
                <div
                    className={cn(
                        "hidden lg:flex flex-col border-r bg-card",
                        collapsed ? "w-16" : "w-64"
                    )}
                >
                    {/* Logo */}
                    <div className="p-6 flex justify-center gap-2">
                        <Image
                            src="/icons/logo1.png"
                            alt="Financial Compass Logo"
                            width={100}
                            height={100}
                        />
                        
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md mb-1 hover:bg-accent group",
                                        isActive && "bg-accent"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "h-5 w-5",
                                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                                    )} />
                                    {!collapsed && (
                                        <span className={cn(
                                            "text-sm",
                                            isActive ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
                                        )}>
                                            {item.name}
                                        </span>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-full flex items-center justify-center"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            <ChevronLeft className={cn(
                                "h-6 w-6 text-muted-foreground",
                                collapsed && "rotate-180"
                            )} />
                        </Button>
                    </div>
                </div>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto bg-background">
                    <div className="container mx-auto p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}