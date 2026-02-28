export default function PersonaSwitcher({ personas, activeId, onSwitch, switchTime }) {
    return (
        <div className="p-4">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                Personas
            </h2>
            <div className="space-y-2">
                {personas.map((p) => (
                    <div
                        key={p.id}
                        onClick={() => onSwitch(p.id)}
                        className={`persona-card ${p.id === activeId ? 'active' : ''}`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm">{p.name}</span>
                            {p.id === activeId && (
                                <span className="badge-passed text-[10px] px-2 py-0.5 rounded-full font-medium">
                                    ACTIVE
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mb-2">{p.description}</p>
                        <div className="flex flex-wrap gap-1">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-primary)] text-[var(--text-muted)] border border-[var(--border)]">
                                {p.guardrail_level.toUpperCase()}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-primary)] text-[var(--text-muted)] border border-[var(--border)]">
                                {p.corpus_files.length} docs
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {switchTime !== null && (
                <div className="mt-3 text-center">
                    <span className="text-xs text-[var(--success)] animate-fade-in-up">
                        ⚡ Switched in {switchTime}ms
                    </span>
                </div>
            )}
        </div>
    );
}
