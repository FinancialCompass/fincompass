'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Receipt,
    CreditCard,
    Settings,
    ChevronLeft,
    Menu,
    LogOut
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useUser } from '@/contexts/UserContext';
import { useState, useEffect } from 'react'

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
    const { user, signOut } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    if (!user) return null;

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

                    {/* Footer with Avatar and Collapse Button */}
                    <div className="p-4 border-t space-y-4">
                        <div className="flex items-center justify-between">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-auto p-0">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} alt={`${user.name}'s avatar`} className="object-cover" />
                                            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        {!collapsed && (
                                            <div className="ml-2 text-left">
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-2" side="right">
                                    <div className="flex items-center gap-2 p-2">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user.avatar} alt={`${user.name}'s avatar`} className="object-cover" />
                                            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="space-y-1">
                                        <p className="px-2 text-sm text-muted-foreground">Account Status</p>
                                        <div className="px-2 py-1">
                                            <p className="text-sm font-medium">{user.plan?.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Next billing: {user.plan?.nextBilling}
                                            </p>
                                        </div>
                                    </div>
                                    <Separator className="my-2" />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start"
                                        onClick={signOut}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign out
                                    </Button>
                                </PopoverContent>
                            </Popover>
                        </div>
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