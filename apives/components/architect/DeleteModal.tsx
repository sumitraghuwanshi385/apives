import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { ArchitectProject } from '../../services/architectEngine';

interface DeleteModalProps {
  project: ArchitectProject | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ project, onCancel, onConfirm }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-dark-900 border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-red-400">
          <AlertTriangle size={20} />
          <h3 className="text-sm font-bold text-white font-mono">Delete Architecture Project?</h3>
        </div>
        <p className="text-xs text-slate-300 font-light leading-relaxed">
          Are you sure you want to remove <strong className="text-white">{project.name}</strong> from your local session history? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2.5 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-xs font-mono font-bold transition-colors flex items-center gap-1.5"
          >
            <Trash2 size={13} /> Delete Project
          </button>
        </div>
      </div>
    </div>
  );
};
