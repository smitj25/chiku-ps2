export default function CitationBadge({ citation }) {
    const statusClass = `badge-${citation.status}`;
    const icons = { verified: '✅', partial: '⚠️', unverified: '❌' };
    const icon = icons[citation.status] || '❓';

    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusClass}`}
            title={`${citation.source_file}${citation.page ? `, Page ${citation.page}` : ''}${citation.section ? `, ${citation.section}` : ''}\nConfidence: ${(citation.confidence * 100).toFixed(0)}%`}
        >
            <span>{icon}</span>
            <span>{citation.source_file}</span>
            {citation.page && <span className="opacity-70">p.{citation.page}</span>}
        </span>
    );
}
