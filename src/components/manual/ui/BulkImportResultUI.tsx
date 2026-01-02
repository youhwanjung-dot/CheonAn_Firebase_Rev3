import { CheckCircle, AlertTriangle, XCircle, Trash2, Save } from 'lucide-react';

const BulkImportResultUI = () => {
    
    const resultData = [
        { 
            status: 'success', 
            id: 'CHEM-001', 
            name: '폴리염화알루미늄', 
            quantity: 100, 
            date: '2023-10-25', 
            message: '성공' 
        },
        { 
            status: 'error', 
            id: 'CHEM-999', 
            name: '알수없는품목', 
            quantity: 50, 
            date: '2023-10-25', 
            message: '존재하지 않는 품목 ID' 
        },
        { 
            status: 'warning', 
            id: 'CHEM-003', 
            name: '가성소다', 
            quantity: 0, 
            date: '2023-10-25', 
            message: '수량은 0보다 커야 합니다.' 
        },
        { 
            status: 'success', 
            id: 'CHEM-004', 
            name: '황산알루미늄', 
            quantity: 200, 
            date: '2023-10-25', 
            message: '성공' 
        },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle size={18} className="text-green-500" />;
            case 'error':
                return <XCircle size={18} className="text-red-500" />;
            case 'warning':
                return <AlertTriangle size={18} className="text-amber-500" />;
            default:
                return null;
        }
    };
    
    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-slate-700 w-full select-none">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 sm:mb-0">유효성 검사 결과</h4>
                <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-green-600 dark:text-green-400"><CheckCircle size={14}/> 성공: 2건</span>
                    <span className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400"><AlertTriangle size={14}/> 수정 필요: 1건</span>
                    <span className="flex items-center gap-1.5 font-semibold text-red-600 dark:text-red-500"><XCircle size={14}/> 실패: 1건</span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-full text-sm">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 p-2 rounded-t-md">
                        <div className="col-span-1">상태</div>
                        <div className="col-span-2">품목 ID</div>
                        <div className="col-span-2">품명</div>
                        <div className="col-span-1">수량</div>
                        <div className="col-span-2">입고일</div>
                        <div className="col-span-3">메시지</div>
                        <div className="col-span-1 text-center">관리</div>
                    </div>

                    {/* Body */}
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {resultData.map((item, index) => (
                            <div key={index} className={`grid grid-cols-12 gap-2 items-center p-2 ${item.status === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}>
                                <div className="col-span-1 flex justify-center">{getStatusIcon(item.status)}</div>
                                <div className="col-span-2 font-mono text-slate-700 dark:text-slate-300">{item.id}</div>
                                <div className="col-span-2">
                                    {item.status === 'warning' ? 
                                        <input type="text" defaultValue={item.name} className="w-full text-xs p-1 rounded-md border-amber-300 bg-white dark:bg-slate-700 dark:border-slate-600" />
                                        : <span className="text-slate-800 dark:text-slate-200">{item.name}</span>
                                    }
                                </div>
                                <div className="col-span-1">
                                    {item.status === 'warning' ?
                                        <input type="number" defaultValue={item.quantity} className="w-full text-xs p-1 rounded-md border-amber-300 bg-white dark:bg-slate-700 dark:border-slate-600" />
                                        : <span className="text-right w-full pr-2 text-slate-800 dark:text-slate-200">{item.quantity}</span>
                                    }
                                </div>
                                <div className="col-span-2 text-slate-600 dark:text-slate-400">{item.date}</div>
                                <div className={`col-span-3 font-medium ${
                                    item.status === 'success' ? 'text-green-600' :
                                    item.status === 'error' ? 'text-red-600' : 'text-amber-600'
                                }`}>{item.message}</div>
                                <div className="col-span-1 flex items-center justify-center gap-1">
                                    {item.status === 'warning' && <button className="p-1 text-slate-500 hover:text-blue-600"><Save size={16} /></button>}
                                    {item.status !== 'success' && <button className="p-1 text-slate-500 hover:text-red-600"><Trash2 size={16} /></button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-end items-center gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button className="px-4 py-2 text-sm font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">전체 취소</button>
                <button className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md">성공 건만 등록</button>
            </div>
        </div>
    );
};

export default BulkImportResultUI;
