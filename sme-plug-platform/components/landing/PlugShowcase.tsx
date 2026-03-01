"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PLUGS } from "@/lib/data";
import { ArrowRight } from "lucide-react";

type Plug = (typeof PLUGS)[number];

function PlugCard({ plug, index }: { plug: Plug; index: number }) {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="rounded-xl cursor-default transition-all duration-400 h-full flex flex-col relative overflow-hidden"
            style={{
                background: hovered ? plug.bg : "rgba(255,255,255,0.02)",
                border: `1px solid ${hovered ? plug.border : "rgba(255,255,255,0.06)"}`,
            }}
        >
            {/* Hover glow */}
            {hovered && (
                <div
                    className="absolute top-0 left-0 right-0 h-32 pointer-events-none transition-opacity duration-500"
                    style={{
                        background: `linear-gradient(180deg, ${plug.bg}, transparent)`,
                    }}
                />
            )}

            <div className="relative p-7 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform duration-300"
                        style={{
                            background: plug.bg,
                            border: `1px solid ${plug.border}`,
                            transform: hovered ? "scale(1.05)" : "scale(1)",
                        }}
                    >
                        {plug.icon}
                    </div>
                    <div className="text-right">
                        <div className="font-mono text-[10px] text-text-faint mb-1 tracking-[0.08em]">
                            RAGAS Score
                        </div>
                        <div className="font-mono text-xl font-bold text-lime tracking-tight">
                            {plug.score.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Domain */}
                <div className="mb-2">
                    <span
                        className="font-mono text-[10px] tracking-[0.1em] uppercase"
                        style={{ color: plug.color }}
                    >
                        {plug.domain}
                    </span>
                </div>

                {/* Name */}
                <div className="text-xl font-bold text-text-primary mb-3.5 tracking-[-0.02em] font-display">
                    {plug.name}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5 min-h-[42px]">
                    {plug.tags.map((tag) => (
                        <span
                            key={tag}
                            className="font-mono text-[10px] bg-[rgba(255,255,255,0.03)] border border-border text-text-muted px-2.5 py-1 rounded-md"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Example query */}
                <div
                    className="rounded-lg p-3.5 font-mono text-xs text-text-muted mb-5 italic leading-relaxed min-h-[96px]"
                    style={{
                        background: "rgba(0,0,0,0.25)",
                        borderLeft: `2px solid ${plug.color}`,
                    }}
                >
                    &quot;{plug.example}&quot;
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-auto pt-5 border-t border-border">
                    <div>
                        <span className="font-mono text-[22px] font-bold text-text-primary">
                            ${plug.price}
                        </span>
                        <span className="font-mono text-xs text-text-faint">/plug/mo</span>
                    </div>
                    <button
                        className="font-mono text-[11px] font-bold tracking-[0.04em] px-4 py-2.5 cursor-pointer transition-all duration-300 rounded-lg flex items-center gap-1.5"
                        style={{
                            background: hovered ? plug.color : "transparent",
                            border: `1px solid ${plug.color}`,
                            color: hovered ? "#06060a" : plug.color,
                        }}
                    >
                        BUY PLUG
                        <ArrowRight size={12} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function PlugShowcase() {
    return (
        <section
            id="marketplace"
            className="py-28 px-6 md:px-20 bg-canvas-subtle border-y border-border relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-30" />

            <div className="max-w-[1240px] mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 bg-[rgba(163,230,53,0.04)] border border-[rgba(163,230,53,0.15)] rounded-full px-4 py-1.5 font-mono text-[11px] text-lime tracking-[0.12em] mb-4">
                            SME PLUG MARKETPLACE
                        </div>
                        <h2 className="font-display text-4xl md:text-[46px] font-bold text-text-primary tracking-[-0.02em]">
                            Choose your expert
                        </h2>
                    </motion.div>
                    <Link
                        href="/marketplace"
                        className="font-mono text-xs text-lime tracking-[0.05em] no-underline hover:underline transition-colors flex items-center gap-1"
                    >
                        VIEW ALL PLUGS
                        <ArrowRight size={12} />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {PLUGS.map((plug, i) => (
                        <PlugCard key={plug.id} plug={plug} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
