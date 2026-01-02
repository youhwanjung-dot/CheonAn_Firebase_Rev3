
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface AnalysisModalProps {
  itemCount: number;
  duplicateCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ itemCount, duplicateCount, onConfirm, onCancel }) => {
  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-blue-100 dark:border-blue-900/50 flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-600 dark:text-blue-400">
            <CheckCircle size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">데이터 등록 분석</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            총 <strong className="text-blue-600 dark:text-blue-400">{itemCount}</strong>건의 데이터를 등록합니다.
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex justify-between">
                <span>신규 등록 예정:</span>
                <span className="font-bold">{itemCount - duplicateCount}건</span>
              </li>
              <li className="flex justify-between text-orange-600 dark:text-orange-400">
                <span>기존 항목 중복 의심 (이름/규격 일치):</span>
                <span className="font-bold">{duplicateCount}건</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            * 중복 의심 항목은 이름과 규격이 동일한 기존 데이터가 존재함을 의미합니다.<br />
            * [확인] 시 엑셀 데이터가 추가(Append) 됩니다.
          </p>
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-md transition-colors"
          >
            확인 및 등록
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
