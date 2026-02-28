export default function PipelineIndicator({ steps, loading }) {
    const stepIcons = {
        'Input Guardrails': '🛡️',
        'Document Retrieval': '📑',
        'LLM Generation': '🧠',
        'Citation Verification': '✅',
        'Output Guardrails': '🛡️',
    };

    if (loading) {
        return (
            <div className="flex items-center gap-3 px-4 py-3 glass-card mb-3 animate-pulse-glow">
                <div className="flex gap-1">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                </div>
                <span className="text-sm text-[var(--text-secondary)]">Processing through SME-Plug pipeline...</span>
            </div>
        );
    }

    if (!steps || steps.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 px-2 py-2 mb-2">
            {steps.map((step, i) => {
                const icon = stepIcons[step.name] || '⚙️';
                const statusColor =
                    step.status === 'passed' ? 'text-[var(--success)]' :
                        step.status === 'blocked' ? 'text-[var(--danger)]' :
                            'text-[var(--warning)]';

                return (
                    <div
                        key={i}
                        className={`pipeline-step flex items-center gap-2 text-xs completed`}
                        title={step.details || ''}
                    >
                        <span>{icon}</span>
                        <span className="font-medium">{step.name}</span>
                        <span className={`${statusColor} font-semibold`}>
                            {step.status === 'passed' ? '✓' : step.status === 'blocked' ? '✗' : '!'}
                        </span>
                        <span className="text-[var(--text-muted)]">{step.duration_ms.toFixed(0)}ms</span>
                    </div>
                );
            })}
        </div>
    );
}
