import { Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';

const InventoryUI = () => {
    const items = [
        { id: 'CHEM-001', name: '폴리염화알루미늄(10%)', category: '응집제', stock: '80 kg', safetyStock: '50 kg', unit: 'kg', supplier: '(주)켐솔루션' },
        { id: 'CHEM-002', name: '차아염소산나트륨', category: '살균소독제', stock: '45 L', safetyStock: '50 L', unit: 'L', supplier: '아쿠아케미' },
        { id: 'CHEM-003', name: '가성소다(25%)', category: 'pH조정제', stock: '15 kg', safetyStock: '20 kg', unit: 'kg', supplier: '대한화학' },
        { id: 'CHEM-004', name: '황산알루미늄', category: '응집제', stock: '95 kg', safetyStock: '50 kg', unit: 'kg', supplier: '(주)켐솔루션' },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm font-sans text-xs">
            {/* Header with Search and Actions */}
            <div className="flex items-center justify-between mb-3">
                <div className="relative w-1/2 sm:w-1/3">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="품목 검색..."
                        className="w-full pl-8 pr-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                        <Filter size={14} />
                        <span>필터</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        <Plus size={14} />
                        <span>신규 품목 등록</span>
                    </button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-slate-100 dark:bg-slate-700 text-left text-slate-600 dark:text-slate-300 font-semibold">
                            <th className="p-2">품목 ID</th>
                            <th className="p-2">품명</th>
                            <th className="p-2">카테고리</th>
                            <th className="p-2 text-right">현재고</th>
                            <th className="p-2 text-right">안전재고</th>
                            <th className="p-2">거래처</th>
                            <th className="p-2 text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                <td className="p-2 font-mono text-slate-500">{item.id}</td>
                                <td className="p-2 font-semibold text-slate-800 dark:text-slate-100">{item.name}</td>
                                <td className="p-2 text-slate-600 dark:text-slate-300">{item.category}</td>
                                <td className={`p-2 text-right font-bold ${item.stock < item.safetyStock ? 'text-red-500' : 'text-slate-800 dark:text-slate-100'}`}>{item.stock}</td>
                                <td className="p-2 text-right text-slate-600 dark:text-slate-300">{item.safetyStock}</td>
                                <td className="p-2 text-slate-600 dark:text-slate-300">{item.supplier}</td>
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

export default InventoryUI;
