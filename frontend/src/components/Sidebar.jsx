import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';


function Sidebar({ activeView, onViewChange, onCreateClick }) {
  const [width, setWidth] = useState(224); // 224px = w-56
  const navigate = useNavigate();

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (e) => {
      const newWidth = Math.min(400, Math.max(160, startWidth + e.clientX - startX));
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [width]);

  const items = [
    { key: 'create', label: 'Create', icon: <span class="material-symbols-outlined">add</span> },
    { key: 'discover', label: 'Discover', icon: <span class="material-symbols-outlined">explore</span> },
    { key: 'feed', label: 'Feed', icon: <span class="material-symbols-outlined">rss_feed</span> },
  ];

  return (
    <aside
      style={{ width: `${width}px` }}
      className="relative flex shrink-0 flex-col border-r border-border/70 bg-surface/80 px-0 py-5 backdrop-blur-xl"
    >
      <div 
      onClick={() => navigate('/')}
      className="px-10 pb-6 text-xl text-center font-semibold tracking-tight text-text cursor-pointer hover:text-accent transition">
        <span className="bg-accent bg-clip-text text-transparent"> SARP</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => {
          const isActive = activeView === item.key;
          return (
            <button
              key={item.key}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-white/5 hover:text-white'}`}
              onClick={item.key === 'create' ? onCreateClick : () => onViewChange(item.key)}
            >
              <span className="flex h-5 w-5 items-center justify-center">{item.icon}</span>
              <span className="leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-accent/40 transition-colors"
      />
    </aside>
  );
}

export default Sidebar;