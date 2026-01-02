import { X, PackagePlus } from 'lucide-react';

interface InventoryNewModalProps {
    onClose: () => void;
}

const InventoryNewModal: React.FC<InventoryNewModalProps> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 font-sans text-sm">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-in zoom-in-75 duration-300">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <PackagePlus size={20} className="text-blue-600"/>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">신규 품목 등록</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">품명</label>
                            <input type="text" placeholder="예: 폴리염화알루미늄(10%)" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                        </div>
                         <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">카테고리</label>
                             <select className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                                <option>응집제</option>
                                <option>살균소독제</option>
                                <option>pH조정제</option>
                             </select>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">안전 재고량</label>
                            <input type="number" placeholder="50" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">단위</label>
                             <select className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                                <option>kg</option>
                                <option>L</option>
                                <option>개</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">거래처</label>
                        <input type="text" placeholder="(주)켐솔루션" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">취소</button>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">저장</button>
                </div>
            </div>
        </div>
    );
};

export default InventoryNewModal;
