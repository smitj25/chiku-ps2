"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
    return (
        <section className="py-32 px-6 md:px-16 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-[1000px] mx-auto rounded-3xl border border-[rgba(163,230,53,0.2)] bg-[linear-gradient(180deg,rgba(163,230,53,0.08),rgba(163,230,53,0.02))] backdrop-blur-xl px-8 py-20 md:px-20 md:py-24 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            >
                <h2 className="ui-page-title text-4xl md:text-[52px] mb-5">
                    Ready to deploy
                    <br />
                    <span className="text-lime">trusted AI?</span>
                </h2>
                <p className="ui-page-subtitle mx-auto mb-10">
                    Join enterprises using Tether to eliminate hallucination risk.
                    <br />
                    Up and running in 60 seconds. No credit card required.
                </p>
                <div className="flex gap-5 justify-center flex-wrap">
                    <Link
                        href="/register"
                        className="bg-lime text-canvas font-mono font-bold text-base tracking-[0.06em] px-10 py-5 rounded hover:opacity-90 hover:-translate-y-1 transition-all shadow-[0_0_20px_rgba(163,230,53,0.4)] no-underline"
                    >
                        GET STARTED FREE →
                    </Link>
                    <Link
                        href="/#marketplace"
                        className="bg-[rgba(255,255,255,0.03)] border border-border-hover rounded text-[rgba(255,255,255,0.7)] font-mono text-base tracking-[0.06em] px-10 py-5 hover:border-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] hover:text-text-primary transition-all no-underline"
                    >
                        BROWSE PLUGS
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
