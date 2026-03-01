"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import TerminalSnippet from "./TerminalSnippet";
import { IDE_LOGOS } from "@/lib/data";

function CitationBadge({ text }: { text: string }) {
    return (
        <span className="inline-flex items-center gap-1 bg-[rgba(251,191,36,0.12)] border border-[rgba(251,191,36,0.3)] text-plug-engineering rounded-[3px] px-2 py-0.5 text-[11px] font-mono">
            📎 {text}
        </span>
    );
}

export default function Hero() {
    return (
        <section className="min-h-screen flex items-center px-6 md:px-16 pt-32 pb-24 relative overflow-hidden border-b border-border">
            {/* BG Glow */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: "18%",
                    left: "52%",
                    width: "720px",
                    height: "720px",
                    background:
                        "radial-gradient(circle, rgba(163,230,53,0.08) 0%, transparent 72%)",
                }}
            />

            <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Left: Copy */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-2 border border-[rgba(163,230,53,0.3)] bg-[rgba(163,230,53,0.05)] px-3.5 py-1.5 mb-8 font-mono text-[11px] text-lime tracking-[0.1em]">
                        <div className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse-lime" />
                        B2B ENTERPRISE · DEVELOPER PLATFORM
                    </div>

                    <h1 className="ui-page-title text-[clamp(42px,5vw,68px)] mb-6">
                        The AI Expert
                        <br />
                        That{" "}
                        <span className="text-lime">Cites Its Sources</span>
                    </h1>

                    <p className="font-mono text-base text-text-muted leading-[1.8] max-w-[50ch] mb-12">
                        Hot-swappable AI expert plugins for enterprise. Legal, Healthcare,
                        Engineering. Every claim verified. Every fact cited. Zero
                        hallucinations. Import to VS Code, Cursor, or any codebase in 60
                        seconds.
                    </p>

                    <div className="flex gap-5 flex-wrap">
                        <Link
                            href="/register"
                            className="bg-lime text-canvas font-mono font-bold text-sm tracking-[0.06em] px-8 py-4 hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg rounded-[4px] no-underline inline-block"
                        >
                            START FOR FREE →
                        </Link>
                        <a
                            href="#marketplace"
                            className="bg-[rgba(255,255,255,0.02)] border border-border-hover text-text-muted font-mono text-sm tracking-[0.06em] px-8 py-4 hover:bg-[rgba(255,255,255,0.05)] hover:text-text-primary transition-all rounded-[4px] no-underline inline-block"
                        >
                            VIEW DEMO
                        </a>
                    </div>

                    {/* Trust strip */}
                    <div className="mt-12">
                        <div className="font-mono text-[11px] text-text-ghost tracking-[0.1em] mb-3">
                            WORKS WITH
                        </div>
                        <div className="flex gap-5 flex-wrap">
                            {IDE_LOGOS.map((logo) => (
                                <span
                                    key={logo}
                                    className="font-mono text-xs text-text-faint border-b border-border pb-0.5"
                                >
                                    {logo}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right: Terminal */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <TerminalSnippet />

                    {/* Sample Response */}
                    <div className="mt-8 section-card p-6 font-mono text-xs">
                        <div className="text-text-faint mb-3 text-[11px] tracking-[0.05em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse-lime" />
                            RESPONSE
                        </div>
                        <div className="text-[rgba(255,255,255,0.85)] leading-[1.7] mb-4">
                            Clause 4.2 creates unlimited liability exposure under GDPR Article
                            83(5)...
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <CitationBadge text="GDPR Art.83, pg 47" />
                            <CitationBadge text="Contract_v3.pdf, pg 12" />
                            <span className="inline-flex items-center gap-1.5 bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.3)] text-plug-healthcare rounded-[3px] px-2.5 py-1 text-[11px] font-mono">
                                ✓ Verified
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
