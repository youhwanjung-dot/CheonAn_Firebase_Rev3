import { ArrowUpCircle, ArrowDownCircle, Search } from 'lucide-react';

const HistoryUI = () => {

    const historyData = [
        { type: 'IN', date: '2023-10-26', name: '폴리염화알루미늄(PAC)', quantity: 500, unit: 'kg', worker: '김현수', note: '정기 입고' },
        { type: 'OUT', date: '2023-10-25', name: '가성소다', quantity: -50, unit: 'kg', worker: '박이서', note: '공정 사용' },
        { type: 'OUT', date: '2023-10-25', name: '황산알루미늄', quantity: -20, unit: 'L', worker: '박이서', note: '' },
        { type: 'IN', date: '2023-10-24', name: '차아염소산나트륨', quantity: 100, unit: 'L', worker: '이하나', note: '긴급 보충' },
        { type: 'IN', date: '2023-10-23', name: '가성소다', quantity: 300, unit: 'kg', worker: '김현수', note: '' },
    ];

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 w-full font-sans select-none">
            {/* Header and Filters */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">재고 변경 이력 조회</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    {/* Date Range */}
                    <div className="flex items-center gap-2">
                        <input type="date" defaultValue="2023-10-01" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"/>
                        <span className="text-slate-500">~</span>
                        <input type="date" defaultValue="2023-10-26" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"/>
                    </div>
                    {/* Item Search */}
                    <input type="text" placeholder="품목명, 품목 ID 검색" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                    {/* Type and Worker Filters */}
                    <select className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700">
                        <option>유형 전체</option>
                        <option>입고</option>
                        <option>출고</option>
                    </select>
                    <input type="text" placeholder="작업자명 검색" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                </div>
                <div className="flex justify-end mt-3">
                     <button className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2">
                        <Search size={16} /> 조회
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto p-4">
                <table className="min-w-full text-sm text-left">
                    <thead className="border-b border-slate-200 dark:border-slate-700">
                        <tr className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                            <th className="p-2">구분</th>
                            <th className="p-2">일자</th>
                            <th className="p-2">품목명</th>
                            <th className="p-2 text-right">수량</th>
                            <th className="p-2">작업자</th>
                            <th className="p-2">비고</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {historyData.map((item, index) => (
                            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-3 whitespace-nowrap">
                                    {item.type === 'IN' 
                                        ? <span className="flex items-center gap-2 font-bold text-blue-600"><ArrowUpCircle size={16}/>입고</span> 
                                        : <span className="flex items-center gap-2 font-bold text-slate-500"><ArrowDownCircle size={16}/>출고</span>
                                    }
                                </td>
                                <td className="p-3 whitespace-nowrap text-slate-600 dark:text-slate-400 font-mono">{item.date}</td>
                                <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{item.name}</td>
                                <td className={`p-3 whitespace-nowrap font-bold text-right ${item.type === 'IN' ? 'text-blue-600' : 'text-slate-500'}`}>
                                    {item.quantity.toLocaleString()} {item.unit}
                                </td>
                                <td className="p-3 whitespace-nowrap text-slate-600 dark:text-slate-300">{item.worker}</td>
                                <td className="p-3 text-slate-500 dark:text-slate-400">{item.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HistoryUI;
