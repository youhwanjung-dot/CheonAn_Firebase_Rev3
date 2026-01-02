import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Edit3, Check } from 'lucide-react';
import { FIELD_SETTINGS_KEY, DEFAULT_DB_FIELDS, FieldDef } from '../constants';

interface LabelSettingsModalProps {
  onClose: () => void;
}

const LabelSettingsModal: React.FC<LabelSettingsModalProps> = ({ onClose }) => {
  const [fields, setFields] = useState<FieldDef[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempLabel, setTempLabel] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FIELD_SETTINGS_KEY);
      const parsed = saved ? JSON.parse(saved) : DEFAULT_DB_FIELDS;
      // Ensure all default fields are present, even if not in saved data
      const completeFields = DEFAULT_DB_FIELDS.map(df => {
          const savedField = parsed.find((f: FieldDef) => f.key === df.key);
          return savedField || df;
      });
      setFields(completeFields);
    } catch {
      setFields(DEFAULT_DB_FIELDS);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(FIELD_SETTINGS_KEY, JSON.stringify(fields));
    alert('설정이 저장되었습니다.');
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('모든 필드 명칭을 기본값으로 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setFields(DEFAULT_DB_FIELDS);
      localStorage.removeItem(FIELD_SETTINGS_KEY);
    }
  };

  const startEditing = (field: FieldDef) => {
    setEditingKey(field.key);
    setTempLabel(field.label);
  };

  const confirmEdit = () => {
    if (editingKey && tempLabel.trim()) {
      setFields(prev => 
        prev.map(f => f.key === editingKey ? { ...f, label: tempLabel.trim() } : f)
      );
    }
    setEditingKey(null);
    setTempLabel('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 flex flex-col max-h-[80vh]">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Edit3 className="text-cyan-600 dark:text-cyan-400" />
            DB 필드 명칭 설정
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 bg-slate-100 dark:bg-slate-700/50 p-3 rounded-md">
            여기서 필드 이름을 변경하면, 시스템 전반(테이블 헤더, 엑셀 가져오기 등)에 적용됩니다. 
            예를 들어 &apos;제조사&apos;를 &apos;브랜드&apos;로 변경할 수 있습니다.
          </p>
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-2 text-left">기본 필드 (Key)</th>
                  <th className="px-4 py-2 text-left">사용자 정의 명칭 (Label)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {fields.map(field => (
                  <tr key={field.key} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-2 font-mono text-xs text-slate-500">{field.key}</td>
                    <td className="px-4 py-2" onClick={() => startEditing(field)}>
                      {editingKey === field.key ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={tempLabel}
                            onChange={e => setTempLabel(e.target.value)}
                            className="w-full px-2 py-1 border border-blue-400 rounded focus:outline-none bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && confirmEdit()}
                          />
                          <button onClick={confirmEdit} className="p-1 text-green-600"><Check size={16} /></button>
                        </div>
                      ) : (
                        <span className="cursor-pointer hover:text-blue-600 flex items-center gap-2 group">
                           {field.label}
                           <Edit3 size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
          <button onClick={handleReset} className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors">
            <RotateCcw size={14} /> 기본값 복원
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold">
            <Save size={16} /> 설정 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabelSettingsModal;
