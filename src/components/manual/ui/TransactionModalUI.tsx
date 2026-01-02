import { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Check } from 'lucide-react';

const TransactionModalUI = () => {
    const [type, setType] = useState('IN');

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full font-sans select-none">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">재고 변경 등록</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <span className="font-bold text-blue-600 dark:text-blue-400">폴리염화알루미늄(PAC)</span>의 입고 또는 출고 내역을 기록합니다.
                </p>
            </div>

            {/* Body */}
            <div className="p-4">
                <div className="flex gap-2 mb-4">
                    <button 
                        type="button" 
                        onClick={() => setType('IN')}
                        className={`flex-1 py-3 rounded-lg border-2 font-bold flex items-center justify-center gap-2 transition-all ${type === 'IN' ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-300' : 'border-slate-200 text-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'}`}>
                        <ArrowUpCircle size={20} /> 입고 (구매/생산)
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setType('OUT')}
                        className={`flex-1 py-3 rounded-lg border-2 font-bold flex items-center justify-center gap-2 transition-all ${type === 'OUT' ? 'border-slate-600 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200' : 'border-slate-200 text-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'}`}>
                        <ArrowDownCircle size={20} /> 출고 (사용)
                    </button>
                </div>

                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">📅 작업일자</label>
                            <input type="date" defaultValue="2023-10-26" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">📄 {type === 'IN' ? '입고' : '출고'} 수량</label>
                            <input type="number" step="1" placeholder="0" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-right text-lg bg-white dark:bg-slate-800 dark:text-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">👤 작업자</label>
                            <input type="text" defaultValue="김현수" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">👥 담당자</label>
                            <input type="text" placeholder="(선택) 인수/인계자" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">📝 비고</label>
                        <textarea placeholder="(선택) 특이사항을 입력하세요." className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white h-20 resize-none"></textarea>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                <button type="button" className="flex-1 py-3 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">초기화</button>
                <button type="submit" className={`flex-[2] py-3 text-white rounded-lg font-bold shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity ${type === 'IN' ? 'bg-blue-600' : 'bg-slate-600'}`}>
                    <Check size={18} /> {type === 'IN' ? '입고 등록' : '출고 등록'}
                </button>
            </div>
        </div>
    );
}

export default TransactionModalUI;
