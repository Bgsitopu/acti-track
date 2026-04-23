import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  habitName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({ isOpen, habitName, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bento-card w-full max-w-sm bg-[#020617] border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-in fade-in zoom-in duration-200">
        <div className="terminal-header items-center !mb-4 border-red-500/50 text-red-500">
          <span className="flex items-center gap-2"><AlertTriangle size={14} /> SYS.WARN(DELETE_HABIT)</span>
          <button onClick={onCancel} title="Cancel deletion" className="text-text-muted hover:text-red-500 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="text-center py-4">
          <p className="text-text-primary text-sm mb-2">Are you sure you want to permanently delete this entry?</p>
          {habitName && <p className="text-red-400 font-bold mb-6">[{habitName}]</p>}
          
          <div className="flex gap-3 mt-4">
            <button 
              onClick={onCancel}
              title="Do not delete this habit"
              className="flex-1 bg-border/50 hover:bg-border text-text-primary border border-border py-2 rounded text-[11px] uppercase tracking-widest font-bold transition-all"
            >
              [ CANCEL ]
            </button>
            <button 
              onClick={onConfirm}
              title="Permanently delete this habit"
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 py-2 rounded text-[11px] uppercase tracking-widest font-bold transition-all hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]"
            >
              [ CONFIRM_DEL ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
