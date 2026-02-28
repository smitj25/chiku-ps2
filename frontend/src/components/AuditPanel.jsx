import { useState, useEffect } from 'react';
import { getAuditLog, getAuditDetail } from '../api';

export default function AuditPanel({ isOpen, onClose }) {
    const [entries, setEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        if (isOpen) {
            getAuditLog()
                .then(data => setEntries(data.entries || []))
                .catch(err => console.error(err));
        }
    }, [isOpen]);

    const loadDetail = async (queryId) => {
        try {
            const data = await getAuditDetail(queryId);
            setDetail(data);
            setSelectedEntry(queryId);
        } catch (err) {
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative ml-auto w-full max-w-xl glass-card border-l border-[var(--border)] overflow-y-auto animate-fade-in-up">
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[var(--bg-secondary)] border-b border-[var(--border)]">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <span>📋</span> Audit Trail
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4 space-y-3">
                    {!selectedEntry && entries.map((entry, i) => (
                        <div
                            key={i}
                            onClick={() => loadDetail(entry.query_id)}
                            className="p-3 glass-card cursor-pointer hover:border-[var(--accent)] transition-all"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-[var(--accent)] font-mono">
                                    {entry.query_id.slice(0, 8)}...
                                </span>
                                <span className="text-xs text-[var(--text-muted)]">{entry.persona_name}</span>
                            </div>
                            <p className="text-sm text-[var(--text-primary)] mb-1">{entry.query_text}</p>
                            <div className="flex gap-2">
                                <span className="text-[10px] badge-passed px-1.5 py-0.5 rounded-full">
                                    {entry.citation_count} citations
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${entry.hallucination_score <= 0.1 ? 'badge-passed' : 'badge-flagged'
                                    }`}>
                                    H: {(entry.hallucination_score * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    ))}

                    {selectedEntry && detail && (
                        <div className="space-y-4">
                            <button
                                onClick={() => { setSelectedEntry(null); setDetail(null); }}
                                className="text-xs text-[var(--accent)] hover:underline"
                            >
                                ← Back to list
                            </button>

                            {/* Query */}
                            <div className="glass-card p-3">
                                <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Query</h3>
                                <p className="text-sm">{detail.query_text}</p>
                            </div>

                            {/* Input Guardrail */}
                            {detail.input_guardrail && (
                                <div className="glass-card p-3">
                                    <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
                                        🛡️ Input Guardrails
                                    </h3>
                                    <div className="space-y-1">
                                        {Object.entries(detail.input_guardrail.checks).map(([check, passed]) => (
                                            <div key={check} className="flex items-center gap-2 text-xs">
                                                <span>{passed ? '✅' : '❌'}</span>
                                                <span className="text-[var(--text-secondary)]">{check}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Retrieved Sections */}
                            <div className="glass-card p-3">
                                <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
                                    📑 Retrieved Sections
                                </h3>
                                <div className="space-y-1">
                                    {detail.retrieved_sections?.map((s, i) => (
                                        <div key={i} className="text-xs text-[var(--text-secondary)]">
                                            📄 {s.filename} — Page {s.page} — {s.title}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Citations */}
                            <div className="glass-card p-3">
                                <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
                                    ✅ Citations
                                </h3>
                                <div className="space-y-2">
                                    {detail.citations?.map((c, i) => (
                                        <div key={i} className="p-2 bg-[var(--bg-primary)] rounded text-xs">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`badge-${c.status} px-1.5 py-0.5 rounded-full`}>
                                                    {c.status.toUpperCase()}
                                                </span>
                                                <span className="text-[var(--text-muted)]">
                                                    Confidence: {(c.confidence * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <p className="text-[var(--text-secondary)]">
                                                {c.source_file}{c.page ? ` → Page ${c.page}` : ''}{c.section ? ` → ${c.section}` : ''}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Output Guardrail */}
                            {detail.output_guardrail && (
                                <div className="glass-card p-3">
                                    <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
                                        🛡️ Output Guardrails
                                    </h3>
                                    <div className="space-y-1">
                                        {Object.entries(detail.output_guardrail.checks).map(([check, passed]) => (
                                            <div key={check} className="flex items-center gap-2 text-xs">
                                                <span>{passed ? '✅' : '❌'}</span>
                                                <span className="text-[var(--text-secondary)]">{check}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-xs text-[var(--text-muted)]">
                                        Hallucination Score: {(detail.hallucination_score * 100).toFixed(1)}%
                                    </div>
                                </div>
                            )}

                            {/* Raw Response */}
                            <div className="glass-card p-3">
                                <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
                                    Raw LLM Response
                                </h3>
                                <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap overflow-x-auto max-h-60 overflow-y-auto">
                                    {detail.raw_llm_response}
                                </pre>
                            </div>
                        </div>
                    )}

                    {entries.length === 0 && !selectedEntry && (
                        <p className="text-center text-[var(--text-muted)] text-sm py-8">
                            No audit entries yet. Send a query to start building the audit trail.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
