"use client";

import { motion } from "framer-motion";
import { STEPS } from "@/lib/data";
import { ChevronRight } from "lucide-react";

export default function HowItWorks() {
    return (
        <section className="py-28 px-6 md:px-20 border-b border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />

            <div className="max-w-[1240px] mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-[rgba(163,230,53,0.04)] border border-[rgba(163,230,53,0.15)] rounded-full px-4 py-1.5 font-mono text-[11px] text-lime tracking-[0.12em] mb-5">
                        HOW IT WORKS
                    </div>
                    <h2 className="font-display text-4xl md:text-[46px] font-bold text-text-primary tracking-[-0.02em] text-balance">
                        Three steps to trusted AI
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {STEPS.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="relative p-8 rounded-xl border border-border bg-surface hover:border-border-active transition-all duration-300 group"
                        >
                            {/* Arrow connector */}
                            {i < STEPS.length - 1 && (
                                <div className="hidden md:flex absolute top-1/2 -right-3.5 z-10 w-7 h-7 rounded-full bg-canvas-subtle border border-border items-center justify-center">
                                    <ChevronRight size={12} className="text-lime" />
                                </div>
                            )}

                            <div className="font-mono text-[48px] font-bold text-text-ghost leading-none mb-5 tracking-[-0.04em] group-hover:text-lime/20 transition-colors duration-300">
                                {step.step}
                            </div>
                            <div className="font-display text-xl font-bold text-text-primary mb-3 tracking-[-0.01em] group-hover:text-lime transition-colors duration-300">
                                {step.title}
                            </div>
                            <div className="font-mono text-[13px] text-text-muted leading-relaxed">
                                {step.desc}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
