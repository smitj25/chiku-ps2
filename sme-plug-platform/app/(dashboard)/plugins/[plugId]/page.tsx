"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Settings, Book, Key, Star, Shield, Zap, FileText } from "lucide-react";
import { ALL_PLUGS } from "@/lib/data";
import { use } from "react";

const EXTRA_PLUGS: Record<string, { id: string; name: string; domain: string; color: string; bg: string; border: string; score: number; price: number; icon: string; tags: string[]; example: string; description: string; capabilities: string[]; sources: string[]; useCases: string[] }> = {
    "legal-v1": {
        id: "legal-v1", name: "Legal SME", domain: "Compliance & Contracts", color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.25)", score: 0.93, price: 500, icon: "⚖",
        tags: ["Contract Review", "GDPR", "Litigation", "IP Law"],
        example: "Analyze clause 4.2 for liability exposure under GDPR Article 83.",
        description: "Enterprise-grade legal analysis powered by domain-specific RAG. Every citation verified against source documents. Built for compliance teams, legal ops, and contract reviewers.",
        capabilities: ["Contract clause analysis with page-level citations", "GDPR/CCPA compliance gap detection", "Litigation risk assessment with precedent references", "IP portfolio review and patent analysis", "Regulatory change impact analysis"],
        sources: ["GDPR Full Text (EU Regulation 2016/679)", "Contract law precedents database", "IP Law reference library", "Compliance frameworks (SOX, HIPAA, PCI-DSS)"],
        useCases: ["Review vendor contracts for liability clauses", "Generate GDPR compliance reports", "Analyze patent claims for infringement risk", "Draft regulatory response letters with citations"],
    },
    "healthcare-v1": {
        id: "healthcare-v1", name: "Healthcare SME", domain: "Clinical & Compliance", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.25)", score: 0.91, price: 500, icon: "⚕",
        tags: ["Clinical Notes", "ICD Coding", "Drug Interactions", "EHR"],
        example: "Summarize treatment protocol for Type 2 Diabetes per ADA 2024.",
        description: "Clinical intelligence for healthcare organizations. Verified against medical literature and clinical guidelines. HIPAA-compliant by design.",
        capabilities: ["Clinical guideline summarization with ADA/WHO citations", "ICD-10/11 coding assistance", "Drug interaction checking against FDA databases", "EHR data extraction and summarization", "Clinical trial protocol review"],
        sources: ["ADA Standards of Medical Care 2024", "WHO Clinical Guidelines", "FDA Drug Database", "ICD-10-CM/PCS Code Sets"],
        useCases: ["Summarize patient history for handoffs", "Check drug interactions before prescribing", "Generate clinical documentation", "Review clinical trial eligibility criteria"],
    },
    "finance": {
        id: "finance", name: "Financial SME", domain: "Advisory & Analysis", color: "#eab308", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.25)", score: 0.94, price: 500, icon: "📈",
        tags: ["Market Analysis", "Risk Assessment", "Portfolio Review", "Regulations"],
        example: "Evaluate ESG risk factors for new energy portfolio given SEC 2024 guidelines.",
        description: "Enterprise-grade financial analysis. Every insight verified against market data and regulatory frameworks. Built for analysts, advisors, and risk teams.",
        capabilities: ["Portfolio risk assessment with market data citations", "SEC compliance gap detection", "Financial modeling and forecasting", "Market trend analysis", "Investment strategy review"],
        sources: ["SEC Regulations", "Financial Market Data", "Economic Indicators", "Compliance frameworks (SOX, FINRA)"],
        useCases: ["Review portfolio for regulatory compliance", "Generate risk assessment reports", "Analyze market trends for investment strategy", "Draft regulatory response letters with citations"],
    },
};

function getPlugData(plugId: string) {
    const extra = EXTRA_PLUGS[plugId];
    if (extra) return extra;
    const base = ALL_PLUGS.find(p => p.id === plugId.replace("-v1", ""));
    if (base) return { ...base, description: `Expert AI plugin for ${base.domain}.`, capabilities: base.tags.map(t => `${t} analysis and verification`), sources: ["Domain-specific knowledge base"], useCases: [`Use ${base.name} for accurate, cited responses`] };
    return null;
}

export default function PluginDetailPage({ params }: { params: Promise<{ plugId: string }> }) {
    const { plugId } = use(params);
    const plug = getPlugData(plugId);

    if (!plug) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <div className="font-display text-2xl font-bold text-text-primary mb-2">Plugin not found</div>
                    <Link href="/plugins" className="font-mono text-sm text-lime no-underline hover:underline">← Back to plugins</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <Link href="/plugins" className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted no-underline hover:text-lime mb-8">
                <ArrowLeft size={14} /> Back to My Plugins
            </Link>

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-card p-10">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0" style={{ background: plug.bg, border: `1px solid ${plug.border}` }}>
                        {plug.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="ui-page-title text-3xl">{plug.name}</h1>
                            <span className="font-mono text-[10px] bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.3)] text-plug-healthcare px-2 py-0.5 rounded-[3px]">ACTIVE</span>
                        </div>
                        <div className="font-mono text-[11px] tracking-[0.05em] mb-3" style={{ color: plug.color }}>{plug.domain}</div>
                        <p className="font-mono text-sm text-text-muted leading-[1.7] max-w-2xl">{plug.description}</p>
                    </div>
                    <div className="text-center shrink-0 bg-canvas border border-border rounded-xl px-8 py-5">
                        <div className="font-mono text-4xl font-bold text-lime mb-1">{plug.score.toFixed(2)}</div>
                        <div className="font-mono text-[10px] text-text-ghost tracking-[0.1em]">RAGAS SCORE</div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-8 pt-8 border-t border-border">
                    <Link href={`/plugins/${plugId}/configure`} className="flex items-center gap-2 font-mono text-xs font-bold text-canvas bg-lime px-5 py-2.5 no-underline hover:opacity-90 rounded-md"><Settings size={14} /> Configure</Link>
                    <Link href={`/plugins/${plugId}/docs`} className="flex items-center gap-2 font-mono text-xs text-text-muted border border-border px-5 py-2.5 no-underline hover:border-lime hover:text-lime rounded-md"><Book size={14} /> Documentation</Link>
                    <Link href="/api-keys" className="flex items-center gap-2 font-mono text-xs text-text-muted border border-border px-5 py-2.5 no-underline hover:border-lime hover:text-lime rounded-md"><Key size={14} /> API Keys</Link>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Capabilities */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-card p-8">
                    <div className="flex items-center gap-2 mb-5">
                        <Zap size={14} className="text-lime" />
                        <div className="font-mono text-[10px] text-text-faint tracking-[0.1em]">CAPABILITIES</div>
                    </div>
                    <div className="space-y-4">
                        {plug.capabilities.map((c, i) => (
                            <div key={i} className="flex items-start gap-3 bg-canvas border border-border rounded-lg px-5 py-4">
                                <Star size={14} className="text-lime mt-0.5 shrink-0" />
                                <span className="font-mono text-sm text-text-secondary leading-[1.6]">{c}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Sources + Use Cases */}
                <div className="space-y-8">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="section-card p-8">
                        <div className="flex items-center gap-2 mb-5">
                            <FileText size={14} className="text-plug-legal" />
                            <div className="font-mono text-[10px] text-text-faint tracking-[0.1em]">KNOWLEDGE SOURCES</div>
                        </div>
                        <div className="space-y-3">
                            {plug.sources.map((s, i) => (
                                <div key={i} className="flex items-center gap-3 bg-canvas border border-border rounded-lg px-5 py-3.5">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: plug.color }} />
                                    <span className="font-mono text-sm text-text-muted">{s}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="section-card p-8">
                        <div className="flex items-center gap-2 mb-5">
                            <Shield size={14} className="text-plug-engineering" />
                            <div className="font-mono text-[10px] text-text-faint tracking-[0.1em]">USE CASES</div>
                        </div>
                        <div className="space-y-3">
                            {plug.useCases.map((u, i) => (
                                <div key={i} className="flex items-start gap-4 bg-canvas border border-border rounded-lg px-5 py-4">
                                    <span className="font-mono text-xs text-lime font-bold shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="font-mono text-sm text-text-secondary leading-[1.6]">{u}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Quick example */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="section-card p-8">
                <div className="font-mono text-[10px] text-text-faint tracking-[0.1em] mb-4">EXAMPLE QUERY</div>
                <div className="bg-canvas border border-border rounded-lg p-6 font-mono text-base text-text-primary leading-[1.7]">
                    <span className="text-text-ghost">$</span> {plug.example}
                </div>
            </motion.div>
        </div>
    );
}
