const API_BASE = '/api';

export async function queryPipeline(text, personaId, compareMode = false) {
    const res = await fetch(`${API_BASE}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text,
            persona_id: personaId || undefined,
            compare_mode: compareMode,
        }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(err.detail || 'Query failed');
    }
    return res.json();
}

export async function listPersonas() {
    const res = await fetch(`${API_BASE}/personas/`);
    if (!res.ok) throw new Error('Failed to list personas');
    return res.json();
}

export async function switchPersona(personaId) {
    const res = await fetch(`${API_BASE}/personas/switch`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona_id: personaId }),
    });
    if (!res.ok) throw new Error('Failed to switch persona');
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
