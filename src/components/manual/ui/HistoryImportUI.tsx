// import React from 'react'; // 최신 React/Vite에서는 불필요하여 주석 처리 (TS6133)
import { Search, Filter, Plus, Edit, Trash2, ArrowDown, ArrowUp } from 'lucide-react';

const HistoryImportUI = () => {
    const history = [
        { id: 'TR001', date: '2023-10-25', type: '입고', item: '폴리염화알루미늄', quantity: '+100 kg', balance: '80 kg', manager: '김철수' },
        { id: 'TR002', date: '2023-10-25', type: '출고', item: '가성소다', quantity: '-20 kg', balance: '15 kg', manager: '이영희' },
        { id: 'TR003', date: '2023-10-24', type: '입고', item: '차아염소산나트륨', quantity: '+30 L', balance: '45 L', manager: '김철수' },
        { id: 'TR004', date: '2023-10-23', type: '입고', item: '황산알루미늄', quantity: '+50 kg', balance: '95 kg', manager: '박서준' },
    ];

    const getTypeIndicator = (type: string) => {
        if (type === '입고') {
            return <ArrowDown size={14} className="text-green-500" />;
        }
        return <ArrowUp size={14} className="text-red-500" />;
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm font-sans text-xs">
            {/* Header with Search and Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                    <div className="relative">
                         <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="품명, 담당자 검색..." className="w-48 pl-8 pr-3 py-1.5 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                    </div>
                    <input type="date" defaultValue="2023-10-25" className="px-2 py-1.5 border rounded-md dark:bg-slate-700 dark:border-slate-600"/>
                     <button className="flex items-center gap-1.5 px-3 py-1.5 border rounded-md dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                        <Filter size={14} />
                        <span>필터</span>
                    </button>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Plus size={14} />
                    <span>입/출고 등록</span>
                </button>
            </div>

            {/* History Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-slate-100 dark:bg-slate-700 text-left text-slate-600 dark:text-slate-300 font-semibold">
                            <th className="p-2">작업 ID</th>
                            <th className="p-2">작업일자</th>
                            <th className="p-2">유형</th>
                            <th className="p-2">품명</th>
                            <th className="p-2 text-right">변동량</th>
                            <th className="p-2 text-right">최종재고</th>
                            <th className="p-2">담당자</th>
                            <th className="p-2 text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(entry => (
                            <tr key={entry.id} className="border-b dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                <td className="p-2 font-mono text-slate-500">{entry.id}</td>
                                <td className="p-2">{entry.date}</td>
                                <td className="p-2"><div className={`flex items-center gap-1.5 font-bold ${entry.type === '입고' ? 'text-green-600' : 'text-red-600'}`}>{getTypeIndicator(entry.type)} {entry.type}</div></td>
                                <td className="p-2 font-semibold text-slate-800 dark:text-slate-100">{entry.item}</td>
                                <td className={`p-2 text-right font-semibold ${entry.type === '입고' ? 'text-green-600' : 'text-red-600'}`}>{entry.quantity}</td>
                                <td className="p-2 text-right">{entry.balance}</td>
                                <td className="p-2">{entry.manager}</td>
                                <td className="p-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-1 text-blue-600 hover:text-blue-800"><Edit size={14} /></button>
                                        <button className="p-1 text-red-600 hover:text-red-800"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryImportUI;
