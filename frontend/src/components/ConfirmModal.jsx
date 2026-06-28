import React from 'react';

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
      <div className="w-[320px] rounded-2xl border border-border/60 bg-surface/90 p-5 shadow-2xl shadow-black/40">
        <h3 className="text-lg font-semibold text-text">{title || 'Confirm'}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded-lg bg-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/15" onClick={onCancel}>Cancel</button>
          <button className="rounded-lg bg-rose-500/80 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-500" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
