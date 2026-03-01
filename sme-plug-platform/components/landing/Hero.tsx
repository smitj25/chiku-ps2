"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import TerminalSnippet from "./TerminalSnippet";
import { IDE_LOGOS } from "@/lib/data";
import { Shield, ArrowRight } from "lucide-react";

function CitationBadge({ text }: { text: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.2)] text-plug-engineering rounded-md px-2.5 py-1 text-[11px] font-mono">
            <span className="w-1 h-1 rounded-full bg-plug-engineering" />
            {text}
        </span>
    );
}

export default function Hero() {
    return (
        <section className="min-h-screen flex items-center px-6 md:px-20 pt-32 pb-24 relative overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 bg-grid pointer-events-none" />

            {/* Primary glow */}
            <div
                className="absolute pointer-events-none animate-glow-pulse"
                style={{
                    top: "10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "900px",
                    height: "900px",
                    background:
                        "radial-gradient(circle, rgba(163,230,53,0.07) 0%, rgba(163,230,53,0.02) 40%, transparent 70%)",
                }}
            />

            {/* Secondary accent glow */}
            <div
                className="absolute pointer-events-none"
                style={{
                    bottom: "15%",
                    left: "20%",
                    width: "400px",
                    height: "400px",
                    background:
                        "radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 70%)",
                }}
            />

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-canvas to-transparent pointer-events-none" />

            <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
                {/* Left: Copy */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-2.5 border border-[rgba(163,230,53,0.2)] bg-[rgba(163,230,53,0.04)] px-4 py-2 rounded-full mb-8 font-mono text-[11px] text-lime tracking-[0.1em]">
                        <div className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse-lime" />
                        B2B ENTERPRISE
                        <span className="w-px h-3 bg-[rgba(163,230,53,0.3)]" />
                        DEVELOPER PLATFORM
                    </div>

                    <h1 className="ui-page-title text-[clamp(40px,5vw,64px)] mb-7 leading-[1.05]">
                        The AI Expert
                        <br />
                        That{" "}
                        <span className="text-lime relative">
                            Cites Its Sources
                            <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-lime/60 via-lime/20 to-transparent" />
                        </span>
                    </h1>

                    <p className="font-mono text-[14px] text-text-muted ui-copy max-w-[54ch] mb-10 leading-relaxed">
                        Hot-swappable AI expert plugins for enterprise. Legal, Healthcare,
                        Engineering. Every claim verified. Every fact cited. Zero
                        hallucinations. Import to VS Code, Cursor, or any codebase in 60
                        seconds.
                    </p>

                    <div className="flex gap-3 flex-wrap">
                        <Link
                            href="/register"
                            className="group bg-lime text-canvas font-mono font-bold text-[13px] tracking-[0.04em] px-7 py-3.5 rounded-lg hover:shadow-[0_0_30px_rgba(163,230,53,0.3)] transition-all duration-300 no-underline inline-flex items-center gap-2"
                        >
                            START FOR FREE
                            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Link>
                        <a
                            href="#marketplace"
                            className="bg-transparent border border-border-hover text-text-muted font-mono text-[13px] tracking-[0.04em] px-7 py-3.5 rounded-lg hover:border-[rgba(255,255,255,0.25)] hover:text-text-primary hover:bg-[rgba(255,255,255,0.03)] transition-all duration-300 no-underline inline-block"
                        >
                            VIEW DEMO
                        </a>
                    </div>

                    {/* Trust strip */}
                    <div className="mt-14 pt-8 border-t border-border">
                        <div className="font-mono text-[10px] text-text-ghost tracking-[0.12em] mb-4">
                            WORKS WITH
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            {IDE_LOGOS.map((logo) => (
                                <span
                                    key={logo}
                                    className="font-mono text-[11px] text-text-faint px-3 py-1.5 rounded-md border border-border bg-surface hover:border-border-hover hover:text-text-muted transition-all duration-200"
                                >
                                    {logo}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right: Terminal */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative"
                >
                    {/* Terminal glow */}
                    <div className="absolute -inset-4 bg-gradient-to-br from-[rgba(163,230,53,0.04)] to-transparent rounded-3xl pointer-events-none" />

                    <div className="relative">
                        <TerminalSnippet />

                        {/* Sample Response */}
                        <div className="mt-4 glass rounded-xl p-5 font-mono text-xs">
                            <div className="flex items-center gap-2 text-text-faint mb-3 text-[11px] tracking-[0.06em]">
                                <div className="w-4 h-4 rounded-full bg-[rgba(163,230,53,0.1)] flex items-center justify-center">
                                    <ArrowRight size={8} className="text-lime" />
                                </div>
                                RESPONSE
                            </div>
                            <div className="text-text-secondary leading-relaxed mb-3">
                                Clause 4.2 creates unlimited liability exposure under GDPR Article
                                83(5)...
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <CitationBadge text="GDPR Art.83, pg 47" />
                                <CitationBadge text="Contract_v3.pdf, pg 12" />
                                <span className="inline-flex items-center gap-1.5 bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.2)] text-plug-healthcare rounded-md px-2.5 py-1 text-[11px] font-mono">
                                    <Shield size={10} />
                                    Verified
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
