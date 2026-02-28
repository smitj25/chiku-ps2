import { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import PersonaSwitcher from './components/PersonaSwitcher';
import AuditPanel from './components/AuditPanel';
import { useChat } from './hooks/useChat';
import { listPersonas, switchPersona } from './api';

export default function App() {
  const { messages, loading, sendMessage, clearMessages } = useChat();
  const [personas, setPersonas] = useState([]);
  const [activePersonaId, setActivePersonaId] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [switchTime, setSwitchTime] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      const data = await listPersonas();
      setPersonas(data.personas || []);
      setActivePersonaId(data.active_persona_id);
    } catch (err) {
      console.error('Failed to load personas:', err);
    }
  };

  const handleSwitch = async (personaId) => {
    try {
      const data = await switchPersona(personaId);
      setActivePersonaId(personaId);
      setSwitchTime(data.switch_time_ms);
      setTimeout(() => setSwitchTime(null), 3000);
    } catch (err) {
      console.error('Failed to switch persona:', err);
    }
  };

  const handleSend = (text) => {
    sendMessage(text, activePersonaId, compareMode);
  };

  const activeName = personas.find(p => p.id === activePersonaId)?.name || 'Loading...';

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] transition-colors text-[var(--text-muted)]"
          >
            ☰
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔌</span>
            <span className="font-bold text-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
              SME-Plug
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active persona badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 glass-card text-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
            <span className="text-[var(--text-secondary)]">Persona:</span>
            <span className="font-semibold text-[var(--text-primary)]">{activeName}</span>
          </div>

          {/* Compare mode toggle */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${compareMode
                ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white'
                : 'glass-card text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            ⚔️ Compare Mode
          </button>

          {/* Audit button */}
          <button
            onClick={() => setAuditOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 glass-card text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all rounded-lg"
          >
            📋 Audit Trail
          </button>

          {/* Clear chat */}
          <button
            onClick={clearMessages}
            className="px-3 py-1.5 glass-card text-xs text-[var(--text-muted)] hover:text-[var(--danger)] rounded-lg transition-colors"
          >
            🗑️
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 border-r border-[var(--border)] bg-[var(--bg-secondary)] overflow-y-auto flex-shrink-0">
            <PersonaSwitcher
              personas={personas}
              activeId={activePersonaId}
              onSwitch={handleSwitch}
              switchTime={switchTime}
            />

            {/* Info section */}
            <div className="p-4 border-t border-[var(--border)]">
              <h3 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Guardrails Status
              </h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>
                  <span className="text-[var(--text-secondary)]">Input: PII + Injection + Topic</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>
                  <span className="text-[var(--text-secondary)]">Output: Citations + Halluc.</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>
                  <span className="text-[var(--text-secondary)]">Audit: Full trace logging</span>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Chat Area */}
        <main className="flex-1 min-w-0">
          <ChatWindow
            messages={messages}
            loading={loading}
            onSend={handleSend}
            compareMode={compareMode}
          />
        </main>
      </div>

      {/* Audit Panel Overlay */}
      <AuditPanel isOpen={auditOpen} onClose={() => setAuditOpen(false)} />
    </div>
  );
}
