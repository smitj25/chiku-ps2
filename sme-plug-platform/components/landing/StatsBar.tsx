"use client";

import { motion } from "framer-motion";
import { STATS } from "@/lib/data";
import { AlertTriangle } from "lucide-react";

export default function StatsBar() {
    return (
        <section className="border-b border-border py-20 px-6 md:px-20 bg-canvas-subtle relative overflow-hidden">
            <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-50" />

            <div className="max-w-[1240px] mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2.5 justify-center mb-10"
                >
                    <AlertTriangle size={14} className="text-red-stat" />
                    <span className="font-mono text-[11px] text-text-faint tracking-[0.12em]">
                        THE PROBLEM WITH AI TODAY
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="rounded-xl border border-border bg-surface p-7 hover:border-[rgba(239,68,68,0.2)] transition-all duration-300 group"
                        >
                            <div className="font-display text-[52px] font-bold text-red-stat leading-none mb-3 tracking-tight group-hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.3)] transition-all duration-300">
                                {stat.value}
                            </div>
                            <div className="font-mono text-[13px] text-text-muted leading-relaxed mb-3">
                                {stat.label}
                            </div>
                            <div className="font-mono text-[10px] text-text-ghost tracking-[0.1em] flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-text-ghost" />
                                SOURCE: {stat.source}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
