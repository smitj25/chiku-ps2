'use client';

import { useState, useEffect, useCallback } from 'react';
import { backendUrl, publicRuntime } from "@/lib/public-runtime";
import { useOwnedPlugins } from "@/lib/useOwnedPlugins";
import { ALL_PLUGS } from "@/lib/data";

interface Document {
    filename: string;
    size_kb: number;
    uploaded: string;
}

export default function DocumentsPage() {
    const { owned, ready: ownedReady } = useOwnedPlugins();
    const myPlugins = owned.map(id => ALL_PLUGS.find(p => p.id === id)).filter(Boolean) as typeof ALL_PLUGS;

    const [activePlugin, setActivePlugin] = useState<string>('');
    const [documents, setDocuments] = useState<Document[]>([]);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (ownedReady && owned.length > 0 && !activePlugin) {
            setActivePlugin(owned[0]);
        }
    }, [ownedReady, owned, activePlugin]);

    const fetchDocs = useCallback(async () => {
        if (!activePlugin) return;
        try {
            const res = await fetch(
                `${backendUrl("/v1/documents")}?plugin_id=${activePlugin}`,
                { headers: { Authorization: `Bearer ${publicRuntime.demoApiKey}` } }
            );
            const data = await res.json();
            setDocuments(data.documents || []);
        } catch { setDocuments([]); }
    }, [activePlugin]);

    useEffect(() => { fetchDocs(); }, [fetchDocs]);

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        setMessage('');

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('plugin_id', activePlugin);
            try {
                const res = await fetch(backendUrl("/v1/upload"), {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${publicRuntime.demoApiKey}` },
                    body: formData,
                });
                const data = await res.json();
                if (res.ok) {
                    setMessage(`✓ ${data.message}`);
                } else {
                    setMessage(`✗ ${data.detail || 'Upload failed'}`);
                }
            } catch {
                setMessage('✗ Could not connect to backend');
            }
        }
        setUploading(false);
        fetchDocs();
    };

    const handleDelete = async (filename: string) => {
        try {
            await fetch(
                `${backendUrl(`/v1/documents/${encodeURIComponent(filename)}`)}?plugin_id=${activePlugin}`,
                { method: 'DELETE', headers: { Authorization: `Bearer ${publicRuntime.demoApiKey}` } }
            );
            setMessage(`Deleted ${filename}`);
            fetchDocs();
        } catch {
            setMessage('Delete failed');
        }
    };

    const activePluginData = myPlugins.find(p => p.id === activePlugin);
    const pluginColor = activePluginData?.color || '#888';

    if (!ownedReady) return null;

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="page-header flex items-center justify-between">
                <div>
                    <h1 className="ui-page-title text-3xl">Documents</h1>
                    <p className="ui-page-subtitle mt-1">
                        Upload source documents to your SME knowledge base. The AI will cite these — never hallucinate.
                    </p>
                </div>
            </div>

            {/* Plugin Selector */}
            <div className="section-card p-4 flex gap-4 overflow-x-auto">
                {myPlugins.map(p => (
                    <button
                        key={p.id}
                        onClick={() => setActivePlugin(p.id)}
                        className="px-6 py-3 rounded-lg font-mono text-sm font-bold tracking-wide transition-all whitespace-nowrap"
                        style={{
                            background: activePlugin === p.id ? p.color + '22' : '#161b22',
                            border: `2px solid ${activePlugin === p.id ? p.color : '#30363d'}`,
                            color: activePlugin === p.id ? p.color : '#8b949e',
                        }}
                    >
                        {p.icon} {p.name.replace(' SME', '')}
                    </button>
                ))}
                {myPlugins.length === 0 && (
                    <div className="text-text-ghost font-mono text-sm py-2 px-4">
                        You don't own any plugins yet.
                    </div>
                )}
            </div>

            {/* Upload Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
                className="relative rounded-xl p-16 text-center transition-all cursor-pointer"
                style={{
                    border: `2px dashed ${dragOver ? pluginColor : '#30363d'}`,
                    background: dragOver ? pluginColor + '08' : '#0d1117',
                }}
                onClick={() => document.getElementById('file-input')?.click()}
            >
                <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".pdf,.txt,.md,.csv"
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files)}
                />
                <div className="text-4xl mb-3">{uploading ? '⏳' : '📄'}</div>
                <p className="text-white font-semibold text-lg">
                    {uploading ? 'Uploading & indexing...' : 'Drop PDF, TXT, MD, or CSV files here'}
                </p>
                <p className="text-[#8b949e] text-sm mt-1">
                    or click to browse · files are chunked and embedded into ChromaDB
                </p>
            </div>

            {/* Status Message */}
            {message && (
                <div
                    className="px-6 py-4 rounded-lg font-mono text-sm"
                    style={{
                        background: message.startsWith('✓') ? '#0a1a0a' : message.startsWith('✗') ? '#1a0a0a' : '#161b22',
                        border: `1px solid ${message.startsWith('✓') ? '#3fb95040' : message.startsWith('✗') ? '#f8514940' : '#30363d'}`,
                        color: message.startsWith('✓') ? '#3fb950' : message.startsWith('✗') ? '#f85149' : '#e6edf3',
                    }}
                >
                    {message}
                </div>
            )}

            {/* Documents Table */}
            <div className="section-card overflow-hidden">
                <div
                    className="px-6 py-4 font-mono text-xs font-bold tracking-widest uppercase"
                    style={{ background: '#161b22', color: pluginColor, borderBottom: '1px solid #30363d' }}
                >
                    {(activePluginData?.name || '').toUpperCase()} KNOWLEDGE BASE · {documents.length} document{documents.length !== 1 ? 's' : ''}
                </div>

                {documents.length === 0 ? (
                    <div className="px-6 py-16 text-center" style={{ background: '#0d1117' }}>
                        <p className="text-[#484f58] text-lg">No documents uploaded yet</p>
                        <p className="text-[#484f58] text-sm mt-1">
                            Upload a PDF above to start building your knowledge base
                        </p>
                    </div>
                ) : (
                    <table className="w-full" style={{ background: '#0d1117' }}>
                        <thead>
                            <tr style={{ background: '#161b22', borderBottom: '1px solid #30363d' }}>
                                <th className="text-left px-6 py-4 text-[#8b949e] text-xs font-mono uppercase tracking-wider">Filename</th>
                                <th className="text-left px-6 py-4 text-[#8b949e] text-xs font-mono uppercase tracking-wider">Size</th>
                                <th className="text-left px-6 py-4 text-[#8b949e] text-xs font-mono uppercase tracking-wider">Uploaded</th>
                                <th className="text-right px-6 py-4 text-[#8b949e] text-xs font-mono uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc, i) => (
                                <tr key={i} className="border-t" style={{ borderColor: '#21262d' }}>
                                    <td className="px-6 py-4">
                                        <span className="text-white font-mono text-sm">📄 {doc.filename}</span>
                                    </td>
                                    <td className="px-6 py-4 text-[#8b949e] text-sm font-mono">
                                        {doc.size_kb} KB
                                    </td>
                                    <td className="px-6 py-4 text-[#8b949e] text-sm font-mono">
                                        {new Date(doc.uploaded).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(doc.filename)}
                                            className="text-[#f85149] hover:text-[#ff7b72] text-xs font-mono font-bold tracking-wide px-3 py-1.5 rounded transition-colors"
                                            style={{ background: '#f8514910', border: '1px solid #f8514930' }}
                                        >
                                            DELETE
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* How it works */}
            <div className="section-card-subtle p-8">
                <h3 className="text-white font-bold text-sm mb-4 font-mono tracking-wide">HOW RAG CITATIONS WORK</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-center">
                    {[
                        { emoji: '📄', text: 'Upload PDF/TXT to your plugin' },
                        { emoji: '🔪', text: 'Document is chunked into 512-word blocks' },
                        { emoji: '🧠', text: 'Chunks are embedded into ChromaDB' },
                        { emoji: '✅', text: 'Chat queries retrieve real chunks → real citations' },
                    ].map((step, i) => (
                        <div key={i} className="p-6 rounded-lg" style={{ background: '#0d1117', border: '1px solid #21262d' }}>
                            <div className="text-2xl mb-2">{step.emoji}</div>
                            <p className="text-[#8b949e] text-xs">{step.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
