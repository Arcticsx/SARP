import React from 'react';

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-[420px] max-h-[80vh] rounded-2xl border border-border/60 bg-surface/90 p-5 shadow-2xl shadow-black/40 flex flex-col">
        <h3 className="text-lg font-semibold text-text">{title || 'Confirm'}</h3>
        <div className="mt-2 flex-1 overflow-y-auto max-h-[50vh] pr-1">
          <p className="text-sm leading-6 text-slate-300 whitespace-pre-wrap">{message}</p>
        </div>
        <div className="mt-5 flex justify-end gap-2 flex-shrink-0">
          <button
            className="rounded-lg bg-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/15"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-rose-500/80 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}