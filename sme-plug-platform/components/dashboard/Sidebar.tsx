"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Store,
    Puzzle,
    Key,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    FileText,
    GitCompareArrows,
    Database,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/compare", label: "Compare", icon: GitCompareArrows },
    { href: "/marketplace", label: "Marketplace", icon: Store },
    { href: "/plugins", label: "My Plugins", icon: Puzzle },
    { href: "/integrations", label: "Integrations", icon: Database },
    { href: "/documents", label: "Documents", icon: FileText },
    { href: "/api-keys", label: "API Keys", icon: Key },
    { href: "/billing", label: "Billing", icon: CreditCard },
    { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
    userEmail = "admin@acme.com",
    companyName = "Acme Corp"
}: {
    userEmail?: string;
    companyName?: string;
}) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const initials = companyName
        ? companyName.substring(0, 2).toUpperCase()
        : userEmail.substring(0, 2).toUpperCase();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    };

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 bg-surface border border-border rounded-lg p-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
                <Menu size={20} />
            </button>

            {/* Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:relative top-0 left-0 h-screen bg-canvas-subtle border-r border-border flex flex-col z-50 transition-all duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    } ${collapsed ? "w-[80px]" : "w-[272px]"}`}
            >
                {/* Logo */}
                <div className={`h-[70px] flex items-center border-b border-border bg-[rgba(255,255,255,0.01)] transition-all ${collapsed ? "justify-center px-0" : "justify-between px-6"}`}>
                    <Link href="/" className="flex items-center gap-2.5 no-underline">
                        <div
                            className="w-7 h-7 shrink-0"
                            style={{
                                background: "linear-gradient(135deg, #a3e635, #65a30d)",
                                clipPath:
                                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                            }}
                        />
                        {!collapsed && (
                            <span className="font-mono font-bold text-base text-text-primary tracking-tight">
                                te<span className="text-lime">ther</span>
                            </span>
                        )}
                    </Link>
                    {!collapsed && (
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden text-text-faint hover:text-text-primary cursor-pointer bg-transparent border-none"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-[23px] z-50 hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-[#161b22] border border-[#30363d] text-text-muted hover:text-text-primary hover:border-text-ghost transition-all shadow-sm cursor-pointer"
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Nav */}
                <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                title={collapsed ? item.label : undefined}
                                className={`flex items-center px-4 py-3.5 rounded-lg font-mono text-sm no-underline transition-all ${collapsed ? "justify-center" : "gap-4"
                                    } ${isActive
                                        ? "bg-[rgba(163,230,53,0.08)] text-lime border border-[rgba(163,230,53,0.2)] shadow-sm"
                                        : "text-text-muted hover:text-text-primary hover:bg-[rgba(255,255,255,0.03)] border border-transparent"
                                    }`}
                            >
                                <item.icon size={20} className="shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="px-3 py-5 border-t border-border">
                    {!collapsed ? (
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[rgba(163,230,53,0.15)] flex items-center justify-center font-mono text-sm text-lime font-bold shrink-0">
                                {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-mono text-xs text-text-primary truncate">
                                    {userEmail}
                                </div>
                                <div className="font-mono text-[11px] text-text-ghost truncate mt-0.5">
                                    {companyName}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-[rgba(163,230,53,0.15)] flex items-center justify-center font-mono text-sm text-lime font-bold shrink-0" title={`${userEmail}\n${companyName}`}>
                                {initials}
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        title={collapsed ? "Sign out" : undefined}
                        className={`w-full flex items-center px-4 py-3.5 rounded-lg font-mono text-sm text-text-faint hover:text-red-stat hover:bg-[rgba(239,68,68,0.05)] transition-all cursor-pointer bg-transparent border-none ${collapsed ? "justify-center" : "gap-4"
                            }`}
                    >
                        <LogOut size={18} className="shrink-0" />
                        {!collapsed && <span>Sign out</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
