import { useState, useRef, useEffect } from 'react';
import CitationBadge from './CitationBadge';
import PipelineIndicator from './PipelineIndicator';
import ComparisonView from './ComparisonView';

export default function ChatWindow({ messages, loading, onSend, compareMode }) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        onSend(input.trim());
        setInput('');
    };

    const presetQueries = [
        { label: '🔍 SDN Check', text: 'Is Alexander Petrov on the OFAC SDN list? What are the sanctions implications for onboarding this client?' },
        { label: '📋 AML Policy', text: 'What are the escalation procedures when a sanctions match is confirmed?' },
        { label: '💰 Fund Advice', text: 'What are the best mutual fund options for a conservative investor?' },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-5xl mb-4">🔌</div>
                        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
                            SME-Plug
                        </h2>
                        <p className="text-[var(--text-muted)] text-sm max-w-md mb-6">
                            Enterprise LLM Orchestration Harness — Deterministic, Auditable, Safe.
                            <br />Every answer is cited, verified, and logged.
                        </p>

                        {/* Preset queries */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {presetQueries.map((pq, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setInput(pq.text); }}
                                    className="px-3 py-2 text-xs glass-card hover:border-[var(--accent)] transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                >
                                    {pq.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className="animate-fade-in-up">
                        {msg.role === 'user' && (
                            <div className="flex justify-end">
                                <div className="chat-bubble-user px-4 py-3 max-w-[70%]">
                                    <p className="text-sm text-white">{msg.text}</p>
                                </div>
                            </div>
                        )}

                        {msg.role === 'assistant' && (
                            <div className="flex flex-col gap-2">
                                {/* Pipeline steps */}
                                <PipelineIndicator steps={msg.data.pipeline_steps} />

                                {/* Response */}
                                <div className="chat-bubble-assistant px-4 py-3 max-w-[85%]">
                                    <div className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap mb-3">
                                        {msg.data.response_text}
                                    </div>

                                    {/* Citations */}
                                    {msg.data.citations && msg.data.citations.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {msg.data.citations.map((c, j) => (
                                                <CitationBadge key={j} citation={c} />
                                            ))}
                                        </div>
                                    )}

                                    {/* Stats bar */}
                                    <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
                                        <span className="text-[10px] text-[var(--text-muted)]">
                                            ⏱️ {msg.data.total_duration_ms.toFixed(0)}ms
                                        </span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${msg.data.hallucination_score <= 0.1 ? 'badge-passed' : 'badge-flagged'
                                            }`}>
                                            H: {(msg.data.hallucination_score * 100).toFixed(0)}%
                                        </span>
                                        {msg.data.input_guardrail && (
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full badge-${msg.data.input_guardrail.decision}`}>
                                                Input: {msg.data.input_guardrail.decision}
                                            </span>
                                        )}
                                        {msg.data.output_guardrail && (
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full badge-${msg.data.output_guardrail.decision}`}>
                                                Output: {msg.data.output_guardrail.decision}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {msg.role === 'comparison' && (
                            <ComparisonView data={msg} />
                        )}

                        {msg.role === 'error' && (
                            <div className="flex justify-start">
                                <div className="px-4 py-3 glass-card border-[var(--danger)] max-w-[70%]" style={{ borderColor: 'var(--danger)' }}>
                                    <p className="text-sm text-[var(--danger)]">❌ {msg.text}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <PipelineIndicator loading={true} />
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-[var(--border)]">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            disabled={loading}
                            className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all disabled:opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="px-5 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {compareMode ? '⚔️ Compare' : '🔌 Send'}
                    </button>
                </form>
            </div>
        </div>
    );
}
