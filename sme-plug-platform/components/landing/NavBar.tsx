"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
    { label: "Docs", href: "/docs" },
    { label: "Pricing", href: "/pricing" },
    { label: "Marketplace", href: "/#marketplace" },
];

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? "py-0"
                    : "py-2"
            }`}
        >
            <div
                className={`mx-auto flex h-[60px] items-center justify-between transition-all duration-500 ${
                    scrolled
                        ? "max-w-full px-6 md:px-10 bg-[rgba(6,6,10,0.85)] backdrop-blur-2xl border-b border-border"
                        : "max-w-[1240px] mx-4 md:mx-auto px-6 md:px-8 rounded-2xl bg-[rgba(255,255,255,0.025)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)]"
                }`}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 no-underline group">
                    <div
                        className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
                        style={{
                            background: "linear-gradient(135deg, #a3e635, #65a30d)",
                            clipPath:
                                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        }}
                    />
                    <span className="font-mono font-bold text-lg text-text-primary tracking-tight">
                        te<span className="text-lime">ther</span>
                    </span>
                </Link>

                {/* Links */}
                <div className="flex items-center gap-1 md:gap-2">
                    {NAV_LINKS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="hidden md:block font-mono text-[13px] text-text-faint tracking-wider hover:text-text-primary transition-all duration-200 no-underline px-3 py-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.04)]"
                        >
                            {item.label}
                        </Link>
                    ))}

                    <div className="hidden md:block w-px h-5 bg-border mx-2" />

                    <Link
                        href="/login"
                        className="font-mono text-[13px] text-text-faint tracking-wider hover:text-text-primary transition-all duration-200 no-underline px-3 py-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.04)]"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="font-mono text-[12px] bg-lime text-canvas font-bold tracking-[0.06em] px-5 py-2 rounded-lg hover:shadow-[0_0_20px_rgba(163,230,53,0.25)] transition-all duration-300 no-underline ml-1"
                    >
                        GET STARTED
                    </Link>
                </div>
            </div>
        </nav>
    );
}
