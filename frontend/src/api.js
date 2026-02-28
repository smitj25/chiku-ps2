const API_BASE = '/api';

export async function queryPipeline(text, plugId, compareMode = false) {
    const headers = { 'Content-Type': 'application/json' };
    if (plugId) {
        headers['X-Plug-ID'] = plugId;
    }

    const res = await fetch(`${API_BASE}/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            text,
            compare_mode: compareMode,
        }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(err.detail || 'Query failed');
    }
    return res.json();
}

export async function listPlugs() {
    const res = await fetch(`${API_BASE}/plugs/`);
    if (!res.ok) throw new Error('Failed to list plugs');
    return res.json();
}

export async function getAuditLog() {
    const res = await fetch(`${API_BASE}/audit/`);
    if (!res.ok) throw new Error('Failed to fetch audit log');
    return res.json();
}

export async function getAuditDetail(queryId) {
    const res = await fetch(`${API_BASE}/audit/${queryId}`);
    if (!res.ok) throw new Error('Failed to fetch audit detail');
    return res.json();
}
