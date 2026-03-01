"use client";

import { motion } from "framer-motion";
import { PLANS } from "@/lib/data";
import { Check, ArrowRight } from "lucide-react";

export default function PricingTable() {
    return (
        <section id="pricing" className="py-28 px-6 md:px-20 border-b border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />

            <div className="max-w-[1240px] mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-[rgba(163,230,53,0.04)] border border-[rgba(163,230,53,0.15)] rounded-full px-4 py-1.5 font-mono text-[11px] text-lime tracking-[0.12em] mb-5">
                        PRICING
                    </div>
                    <h2 className="ui-page-title text-4xl md:text-[46px] mb-4 text-balance">
                        Pay per plug, not per seat
                    </h2>
                    <p className="ui-page-subtitle mx-auto">
                        Every plan includes API access, the configurator, and IDE plugins.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                    {PLANS.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className={`rounded-xl relative flex flex-col h-full transition-all duration-300 ${
                                plan.highlight
                                    ? "md:-translate-y-2 glow-border-lime"
                                    : "hover:border-border-hover"
                            }`}
                            style={{
                                background: plan.highlight
                                    ? "rgba(163,230,53,0.04)"
                                    : "rgba(255,255,255,0.02)",
                                border: `1px solid ${
                                    plan.highlight
                                        ? "rgba(163,230,53,0.25)"
                                        : "rgba(255,255,255,0.06)"
                                }`,
                            }}
                        >
                            {/* Popular badge */}
                            {plan.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime text-canvas font-mono text-[10px] font-bold px-4 py-1 tracking-[0.1em] rounded-full">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="p-8 flex flex-col h-full">
                                <div
                                    className={`font-mono text-[10px] tracking-[0.1em] mb-3 ${
                                        plan.highlight ? "text-lime" : "text-text-faint"
                                    }`}
                                >
                                    {plan.name.toUpperCase()}
                                </div>
                                <div className="font-display text-[48px] font-bold text-text-primary leading-none mb-1 tracking-tight">
                                    ${plan.price.toLocaleString()}
                                </div>
                                <div className="font-mono text-xs text-text-faint mb-2">
                                    /plug/month
                                </div>
                                <div className="font-mono text-xs text-text-muted mb-6 pb-6 border-b border-border">
                                    {plan.limit}
                                </div>

                                {/* Features */}
                                <div className="mb-8 space-y-3 flex-1">
                                    {plan.features.map((f, fi) => (
                                        <div key={fi} className="flex gap-3 items-start">
                                            <div className="w-5 h-5 rounded-full bg-[rgba(163,230,53,0.08)] flex items-center justify-center shrink-0 mt-0.5">
                                                <Check size={11} className="text-lime" />
                                            </div>
                                            <span className="font-mono text-[13px] text-text-secondary">
                                                {f}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className={`w-full font-mono text-[12px] py-3.5 cursor-pointer tracking-[0.04em] transition-all duration-300 mt-auto rounded-lg flex items-center justify-center gap-2 ${
                                        plan.highlight
                                            ? "bg-lime border border-lime text-canvas font-bold hover:shadow-[0_0_24px_rgba(163,230,53,0.3)]"
                                            : "bg-transparent border border-border-hover text-text-muted hover:border-[rgba(255,255,255,0.25)] hover:text-text-primary"
                                    }`}
                                >
                                    {plan.cta.toUpperCase()}
                                    <ArrowRight size={13} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
