"use client";

import { motion } from "framer-motion";
import { PLANS } from "@/lib/data";

export default function PricingTable() {
    return (
        <section id="pricing" className="py-32 px-6 md:px-16 border-b border-border bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.02))]">
            <div className="max-w-[1240px] mx-auto">
                <div className="text-center mb-16">
                    <div className="ui-eyebrow text-lime mb-4">
                        PRICING
                    </div>
                    <h2 className="ui-page-title text-4xl md:text-[42px] mb-4">
                        Pay per plug, not per seat
                    </h2>
                    <p className="ui-page-subtitle mx-auto">
                        Every plan includes API access, the configurator, and IDE plugins.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {PLANS.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`rounded-xl p-10 relative flex flex-col h-full transition-transform duration-300 ${plan.highlight ? "md:-translate-y-2 hover:-translate-y-4 shadow-2xl" : "hover:-translate-y-1"
                                }`}
                            style={{
                                background: plan.highlight
                                    ? "rgba(163,230,53,0.04)"
                                    : "rgba(255,255,255,0.02)",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                                border: `1px solid ${plan.highlight
                                    ? "rgba(163,230,53,0.4)"
                                    : "rgba(255,255,255,0.06)"
                                    }`,
                            }}
                        >
                            {/* Popular badge */}
                            {plan.highlight && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-lime text-canvas font-mono text-[11px] font-bold px-4 py-1.5 rounded-sm tracking-[0.1em] shadow-[0_4px_12px_rgba(163,230,53,0.4)]">
                                    MOST POPULAR
                                </div>
                            )}

                            <div
                                className={`font-mono text-[11px] tracking-[0.1em] mb-2 ${plan.highlight ? "text-lime" : "text-text-faint"
                                    }`}
                            >
                                {plan.name.toUpperCase()}
                            </div>
                            <div className="font-display text-[56px] font-bold text-text-primary leading-none mb-2">
                                ${plan.price.toLocaleString()}
                            </div>
                            <div className="font-mono text-[13px] text-text-faint mb-3">
                                /plug/month
                            </div>
                            <div className="font-mono text-[13px] text-text-muted mb-8 pb-8 border-b border-border">
                                {plan.limit}
                            </div>

                            {/* Features */}
                            <div className="mb-7 space-y-2.5 flex-1">
                                {plan.features.map((f, fi) => (
                                    <div key={fi} className="flex gap-2.5 items-start">
                                        <span className="text-lime font-mono text-[13px] shrink-0">
                                            ✓
                                        </span>
                                        <span className="font-mono text-[13px] text-[rgba(255,255,255,0.6)]">
                                            {f}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full font-mono text-[14px] py-4 rounded cursor-pointer tracking-[0.06em] transition-all mt-auto ${plan.highlight
                                    ? "bg-lime border border-lime text-canvas font-bold hover:opacity-90 shadow-[0_0_15px_rgba(163,230,53,0.2)]"
                                    : "bg-transparent border border-border-hover text-text-muted hover:border-[rgba(255,255,255,0.4)] hover:text-text-primary"
                                    }`}
                            >
                                {plan.cta.toUpperCase()} →
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
