// import React from 'react'; // 최신 React/Vite에서는 불필요하여 주석 처리 (TS6133)
import { X, Edit2 } from 'lucide-react';

// item 객체의 타입을 명확하게 정의합니다.
interface ItemType {
    id: string;
    date: string;
    type: string;
    item: string;
    quantity: number;
    unit: string;
    manager: string;
}

// Props 타입을 정의합니다.
interface HistoryEditModalProps {
    item: ItemType | null;
    onClose: () => void;
}

const HistoryEditModal = ({ item, onClose }: HistoryEditModalProps) => {
    // Dummy data for manual display
    const currentItem = item || {
        id: 'TR002',
        date: '2023-10-25',
        type: '출고',
        item: '가성소다',
        quantity: 20,
        unit: 'kg',
        manager: '이영희'
    };

    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 font-sans text-sm">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-in zoom-in-75 duration-300">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <Edit2 size={20} className="text-orange-500"/>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">수불 내역 수정</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">작업 ID</label>
                            <input type="text" disabled value={currentItem.id} className="w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">작업일자</label>
                            <input type="date" defaultValue={currentItem.date} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">유형</label>
                             <select defaultValue={currentItem.type} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600">
                                <option>입고</option>
                                <option>출고</option>
                             </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">품명</label>
                             <select defaultValue={currentItem.item} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600">
                                <option>폴리염화알루미늄</option>
                                <option>가성소다</option>
                                <option>차아염소산나트륨</option>
                             </select>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">변동량</label>
                            <input type="number" defaultValue={currentItem.quantity} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                        </div>
                         <div>
                             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">단위</label>
                             <input type="text" readOnly value={currentItem.unit} className="w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-500" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">담당자</label>
                        <input type="text" defaultValue={currentItem.manager} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">취소</button>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">수정</button>
                </div>
            </div>
        </div>
    );
};

export default HistoryEditModal;
