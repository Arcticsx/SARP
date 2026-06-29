import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import PersonalitySelector from './components/PersonalitySelector.jsx';
import SessionSelector from './components/SessionSelector.jsx';
import Chat from './components/Chat.jsx';
import Sidebar from './components/Sidebar';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  // Derive persona and session directly from location — single source of truth
  const routePersona = location.state?.persona || null;
  const routeSession = location.state?.session || null;
  // Keep a mutable ref for use in callbacks without stale closures
  const personaRef = React.useRef(routePersona);
  personaRef.current = routePersona;

  const handlePersonaSelected = (persona) => {
    navigate(`/sessions/${encodeURIComponent(persona.key)}`, { state: { persona } });
  };

  const handleSessionSelected = (session) => {
    const persona = personaRef.current;
    if (!persona?.key) {
      console.error('No persona selected for session navigation');
      return;
    }
    const targetPath = session
      ? `/chat/${encodeURIComponent(persona.key)}/${session.id}`
      : `/chat/${encodeURIComponent(persona.key)}`;
    navigate(targetPath, { state: { persona, session } });
  };

  const handleBackToPersonalities = () => {
    navigate('/');
  };

  const handleBackToSessions = () => {
    const persona = personaRef.current;
    if (!persona?.key) return;
    navigate(`/sessions/${encodeURIComponent(persona.key)}`, { state: { persona } });
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <Routes>
        <Route
          path="/"
          element={<PersonalitySelector onPersonaSelected={handlePersonaSelected} />}
        />
        <Route
          path="/sessions/:personaKey"
          element={
            <div className="flex h-screen">
              <Sidebar
                activeView="create"
                onViewChange={() => {}}
                onCreateClick={handleBackToPersonalities}
              />
              <main className="flex-1 overflow-hidden">
                <SessionSelector
                  persona={routePersona}
                  onSessionSelected={handleSessionSelected}
                  onBack={handleBackToPersonalities}
                />
              </main>
            </div>
          }
        />
        <Route
          path="/chat/:personaKey/:sessionId?"
          element={
            <div className="flex h-screen">
            <Sidebar
              activeView="discover"
              onViewChange={() => {}}
              onCreateClick={handleBackToPersonalities}
            />
            <main className="flex-1 overflow-hidden">
              <Chat
                persona={routePersona}
                session={routeSession}
                onBack={handleBackToSessions}
              />
            </main>
          </div>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
