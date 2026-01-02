import React from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';

interface ConfirmationModalProps {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  size?: 'md' | 'lg'; // New prop for size
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  isDangerous = false,
  size = 'md', // Default to 'md'
  onConfirm,
  onCancel
}) => {
  const sizeClass = size === 'lg' ? 'max-w-lg' : 'max-w-md';

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full ${sizeClass} border border-slate-200 dark:border-slate-700 overflow-hidden scale-100 transition-transform`}>
        <div className={`p-4 flex items-center gap-3 border-b ${isDangerous ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/50' : 'bg-slate-50 border-slate-100 dark:bg-slate-700/50 dark:border-slate-700'}`}>
          <div className={`p-2 rounded-full ${isDangerous ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'}`}>
            <AlertTriangle size={24} />
          </div>
          <h3 className={`text-lg font-bold ${isDangerous ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>
            {title}
          </h3>
        </div>
        
        <div className="p-6">
          <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {message}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-between gap-3 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white text-sm font-bold shadow-md flex items-center gap-2 transition-colors ${
              isDangerous 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Check size={16} />
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium transition-colors flex items-center gap-2"
          >
            <X size={16} />
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;