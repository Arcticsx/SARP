import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api, getImageUrl } from '../api';

function SessionSelector({ persona, onSessionSelected, onBack }) {
  const { personaKey } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!persona?.name && personaKey) {
      return;
    }
    loadSessions();
  }, [persona, personaKey]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await api.getSessions(persona.name);
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
    setLoading(false);
  };

  const handleSelectSession = (session) => {
    onSessionSelected(session);
  };

  const handleNewSession = () => {
    onSessionSelected(null);
  };

  const handleDeleteSession = async (e, session) => {
    e.stopPropagation();
    if (!window.confirm(`Delete session ${session.id}?`)) return;
    try {
      await api.deleteSession(persona.name, session.id);
      await loadSessions();
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const getDateGroup = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return 'Older';
  };

  const grouped = sessions.reduce((acc, session) => {
    const group = getDateGroup(session.updated_at || session.created_at);
    if (!acc[group]) acc[group] = [];
    acc[group].push(session);
    return acc;
  }, {});

  const sortedGroups = ['Today', 'Yesterday', 'Older'].filter((g) => grouped[g]);

  return (
    <div className="flex h-screen bg-bg text-text">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border/70 bg-surface/80 p-5 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent2 to-accent text-lg font-semibold text-slate-950">
            {persona.avatar ? (
              <img src={getImageUrl(persona.avatar)} alt={persona.name} className="h-full w-full object-cover" />
            ) : (
              <span>{persona.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold text-text">{persona.name}</h3>
            <p className="text-xs text-muted">#{persona.key}</p>
          </div>
        </div>
        <button className="mb-4 rounded-xl border border-border/60 bg-white/5 px-3 py-2 text-left text-sm text-muted transition hover:text-white" onClick={onBack}>
          ← Back to personalities
        </button>
        <div className="mt-auto rounded-xl border border-border/60 bg-white/5 px-3 py-3 text-sm text-muted">
          📋 {sessions.length} sessions
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden px-6 py-6">
        <header className="mb-5 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-text">Choose a session</h1>
          <button className="rounded-full bg-gradient-to-r from-accent to-accent2 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20" onClick={handleNewSession}>
            + New Chat
          </button>
        </header>

        {loading && <p className="py-4 text-center text-muted">Loading sessions…</p>}

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {sortedGroups.map((groupName) => (
            <div key={groupName}>
              <div className="mb-2 border-b border-border/60 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{groupName}</div>
              <div className="space-y-2">
                {grouped[groupName].map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 rounded-2xl border border-border/60 bg-surface/70 px-4 py-3 transition hover:border-accent/30 hover:bg-white/5"
                    onClick={() => handleSelectSession(session)}
                  >
                    <div className="text-xl">💬</div>
                    <div className="flex-1">
                      <div className="font-medium text-text">Session #{session.id}</div>
                      <div className="text-sm text-muted">{new Date(session.updated_at).toLocaleString()}</div>
                    </div>
                    <button
                      className="rounded-lg px-2 py-1 text-sm text-muted transition hover:bg-rose-500/10 hover:text-rose-200"
                      onClick={(e) => handleDeleteSession(e, session)}
                      title="Delete session"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {sessions.length === 0 && !loading && (
            <div className="rounded-2xl border border-border/60 bg-white/5 px-6 py-12 text-center text-muted">
              <p>No previous sessions. Start a new one!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SessionSelector;