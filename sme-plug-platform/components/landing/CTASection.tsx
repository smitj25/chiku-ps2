"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
        <section className="py-28 px-6 md:px-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20" />

            {/* Central glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                    width: "600px",
                    height: "600px",
                    background: "radial-gradient(circle, rgba(163,230,53,0.06) 0%, transparent 60%)",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ease: [0.25, 0.46, 0.45, 0.94] }}
                className="max-w-[900px] mx-auto rounded-2xl border border-[rgba(163,230,53,0.12)] bg-[rgba(163,230,53,0.02)] px-6 py-16 md:px-16 md:py-20 relative z-10 backdrop-blur-sm"
            >
                <h2 className="ui-page-title text-4xl md:text-[52px] mb-5 text-balance">
                    Ready to deploy
                    <br />
                    <span className="text-lime">trusted AI?</span>
                </h2>
                <p className="ui-page-subtitle mx-auto mb-10 text-balance">
                    Join enterprises using Tether to eliminate hallucination risk.
                    <br />
                    Up and running in 60 seconds. No credit card required.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                    <Link
                        href="/register"
                        className="group bg-lime text-canvas font-mono font-bold text-[14px] tracking-[0.04em] px-9 py-4 rounded-lg hover:shadow-[0_0_40px_rgba(163,230,53,0.3)] transition-all duration-300 no-underline inline-flex items-center gap-2"
                    >
                        GET STARTED FREE
                        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                        href="/#marketplace"
                        className="bg-transparent border border-border-hover text-text-muted font-mono text-[14px] tracking-[0.04em] px-9 py-4 rounded-lg hover:border-[rgba(255,255,255,0.25)] hover:text-text-primary hover:bg-[rgba(255,255,255,0.03)] transition-all duration-300 no-underline"
                    >
                        BROWSE PLUGS
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
