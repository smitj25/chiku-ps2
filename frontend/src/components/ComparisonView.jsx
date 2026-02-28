import CitationBadge from './CitationBadge';

export default function ComparisonView({ data }) {
    const { vanilla_response, vanilla_duration_ms, smeplug_response } = data;

    return (
        <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
            {/* Vanilla LLM Side */}
            <div className="glass-card p-4 border-[var(--danger)]" style={{ borderColor: 'var(--danger)' }}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🤖</span>
                        <span className="font-semibold text-sm text-[var(--danger)]">Vanilla LLM</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full badge-blocked font-medium">
                        NO GUARDRAILS
                    </span>
                </div>
                <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap mb-3">
                    {vanilla_response}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
                    <span className="text-xs text-[var(--text-muted)]">⏱️ {vanilla_duration_ms.toFixed(0)}ms</span>
                    <span className="text-xs badge-blocked px-2 py-0.5 rounded-full">❌ No citations</span>
                    <span className="text-xs badge-blocked px-2 py-0.5 rounded-full">❌ No audit trail</span>
                    <span className="text-xs badge-blocked px-2 py-0.5 rounded-full">❌ No guardrails</span>
                </div>
            </div>

            {/* SME-Plug Side */}
            <div className="glass-card p-4 glow-border">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🔌</span>
                        <span className="font-semibold text-sm text-[var(--accent)]">SME-Plug</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full badge-passed font-medium">
                        GUARDRAILS ACTIVE
                    </span>
                </div>
                <div className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap mb-3">
                    {smeplug_response.response_text}
                </div>

                {/* Citations */}
                {smeplug_response.citations && smeplug_response.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {smeplug_response.citations.map((c, i) => (
                            <CitationBadge key={i} citation={c} />
                        ))}
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
                    <span className="text-xs text-[var(--text-muted)]">
                        ⏱️ {smeplug_response.total_duration_ms.toFixed(0)}ms
                    </span>
                    <span className="text-xs badge-passed px-2 py-0.5 rounded-full">
                        ✅ {smeplug_response.citations?.length || 0} citations verified
                    </span>
                    <span className="text-xs badge-passed px-2 py-0.5 rounded-full">
                        📊 Hallucination: {(smeplug_response.hallucination_score * 100).toFixed(0)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
