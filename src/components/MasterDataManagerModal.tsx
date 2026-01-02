import React, { useState, useMemo } from 'react';
import { InventoryItem } from '../types';
import { X, Tag, MapPin, Factory, Edit2, Check, Layers, Package, ArrowRight } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

interface MasterDataManagerModalProps {
  inventory: InventoryItem[];
  onUpdateInventory: (inventory: InventoryItem[]) => void;
  onClose: () => void;
}

// 'name' added to type definition
type MasterType = 'category' | 'location' | 'manufacturer' | 'name';

const MasterDataManagerModal: React.FC<MasterDataManagerModalProps> = ({ inventory, onUpdateInventory, onClose }) => {
  const [activeTab, setActiveTab] = useState<MasterType>('category');
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const [newValue, setNewValue] = useState('');
  
  // State for the confirmation modal
  const [pendingChange, setPendingChange] = useState<{
    oldValue: string;
    newValue: string;
    targetVal: string; // The actual raw value to search for (empty string for '(미지정)')
    count: number;
  } | null>(null);

  // Extract unique values and counts
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    inventory.forEach(item => {
      // Access property dynamically with type assertion
      const val = (item[activeTab as keyof InventoryItem] as string || '').trim() || '(미지정)';
      counts[val] = (counts[val] || 0) + 1;
    });
    // Sort by count descending
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [inventory, activeTab]);

  const handleEditStart = (value: string) => {
    setEditingValue(value);
    setNewValue(value === '(미지정)' ? '' : value);
  };

  const handleSave = () => {
    if (!editingValue) return;
    
    // Determine the actual value to match (handle '(미지정)')
    const targetVal = editingValue === '(미지정)' ? '' : editingValue;
    const updateVal = newValue.trim();

    // If no change, just exit edit mode
    if (targetVal === updateVal) {
        setEditingValue(null);
        return;
    }

    // Prepare data for confirmation modal
    const count = data.find(d => d[0] === editingValue)?.[1] || 0;
    setPendingChange({
        oldValue: editingValue,
        newValue: updateVal || '(미지정)',
        targetVal: targetVal,
        count: count
    });
  };

  const executeBatchUpdate = () => {
    if (!pendingChange) return;

    const { targetVal, newValue: displayNewValue } = pendingChange;
    // If displayNewValue is '(미지정)', the actual value to save is ''
    const actualUpdateVal = displayNewValue === '(미지정)' ? '' : displayNewValue;

    const updatedInventory = inventory.map(item => {
        const itemVal = (item[activeTab as keyof InventoryItem] as string || '').trim();
        if (itemVal === targetVal) {
            return { ...item, [activeTab]: actualUpdateVal };
        }
        return item;
    });

    onUpdateInventory(updatedInventory);
    setEditingValue(null);
    setPendingChange(null);
  };

  const tabs = [
    { id: 'category', label: '대분류 관리', icon: Layers },
    { id: 'name', label: '품목명 관리', icon: Package },
    { id: 'location', label: '보관장소 관리', icon: MapPin },
    { id: 'manufacturer', label: '제조사 관리', icon: Factory },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Tag className="text-indigo-600 dark:text-indigo-400" />
            기준 정보 일괄 관리
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as MasterType); setEditingValue(null); }}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                        activeTab === tab.id 
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' 
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/50">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                        <tr>
                            <th className="px-4 py-3">항목 명칭 (Value)</th>
                            <th className="px-4 py-3 text-right w-24">사용 수</th>
                            <th className="px-4 py-3 text-center w-24">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {data.map(([value, count]) => (
                            <tr key={value} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-4 py-3">
                                    {editingValue === value ? (
                                        <input 
                                            type="text" 
                                            value={newValue}
                                            onChange={(e) => setNewValue(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                            className="w-full px-2 py-1 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                            autoFocus
                                            placeholder="변경할 명칭 입력"
                                        />
                                    ) : (
                                        <span className={`font-medium ${value === '(미지정)' ? 'text-slate-400 italic' : 'text-slate-700 dark:text-slate-200'}`}>
                                            {value}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">
                                    {count}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {editingValue === value ? (
                                        <div className="flex justify-center gap-1">
                                            <button 
                                                onClick={handleSave}
                                                className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                                                title="저장"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button 
                                                onClick={() => setEditingValue(null)}
                                                className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
                                                title="취소"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleEditStart(value)}
                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition-colors"
                                            title="명칭 변경"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                                    데이터가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
                * 항목 명칭을 변경하면 해당 항목을 사용하는 모든 품목 데이터가 일괄 업데이트됩니다.
            </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {pendingChange && (
        <ConfirmationModal
          title="기준 정보 일괄 변경 확인"
          size="lg" // Specify the size prop here
          message={
            <div className="text-center py-2">
               <div className="flex items-center justify-center gap-3 text-lg mb-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-slate-500 line-through decoration-slate-400">{pendingChange.oldValue}</span>
                  <ArrowRight className="text-slate-400" />
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{pendingChange.newValue}</span>
               </div>
               <div className="text-slate-600 dark:text-slate-300">
                 <p className="mb-2">위 명칭으로 일괄 변경하시겠습니까?</p>
                 <p className="text-sm">
                   총 <strong className="text-indigo-600 dark:text-indigo-400">{pendingChange.count}</strong>개의 재고 품목이 업데이트됩니다.
                 </p>
               </div>
            </div>
          }
          confirmLabel="변경사항 적용"
          onConfirm={executeBatchUpdate}
          onCancel={() => setPendingChange(null)}
        />
      )}
    </div>
  );
};

export default MasterDataManagerModal;