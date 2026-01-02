// import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, /*Edit,*/ Save, Trash2 } from 'lucide-react';

const BulkImportResult = () => {
    const validationResults = [
        { status: 'success', data: ['CHEM-001', '폴리염화알루미늄', 100, '2023-10-25'], message: '성공' },
        { status: 'error', data: ['CHEM-999', '알수없는품목', 50, '2023-10-25'], message: '존재하지 않는 품목 ID' },
        { status: 'warning', data: ['CHEM-003', '가성소다', -20, '2023-10-25'], message: '수량은 0보다 커야 합니다.' },
        { status: 'success', data: ['CHEM-004', '황산알루미늄', 200, '2023-10-25'], message: '성공' },
    ];

    const getStatusIndicator = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle size={16} className="text-green-500" />;
            case 'warning':
                return <AlertTriangle size={16} className="text-yellow-500" />;
            case 'error':
                return <XCircle size={16} className="text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm font-sans text-xs space-y-4">
            {/* Summary */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <h4 className="font-bold text-slate-700 dark:text-slate-200">유효성 검사 결과</h4>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-500"/><span>성공: 2건</span></div>
                    <div className="flex items-center gap-1.5"><AlertTriangle size={14} className="text-yellow-500"/><span>수정 필요: 1건</span></div>
                    <div className="flex items-center gap-1.5"><XCircle size={14} className="text-red-500"/><span>실패: 1건</span></div>
                </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
                 <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-slate-100 dark:bg-slate-700 text-left text-slate-600 dark:text-slate-300 font-semibold">
                            <th className="p-2 w-12 text-center">상태</th>
                            <th className="p-2">품목 ID</th>
                            <th className="p-2">품명</th>
                            <th className="p-2 text-right">수량</th>
                            <th className="p-2">입고일</th>
                            <th className="p-2">메시지</th>
                            <th className="p-2 text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {validationResults.map((result, index) => (
                            <tr key={index} className={`border-b border-slate-200 dark:border-slate-700 ${result.status === 'warning' ? 'bg-yellow-50/50 dark:bg-yellow-900/20' : ''}`}>
                                <td className="p-2 text-center flex justify-center items-center h-full">{getStatusIndicator(result.status)}</td>
                                {result.status === 'warning' ? (
                                    <>
                                        <td className="p-1"><input type="text" defaultValue={result.data[0]} className="w-full p-1 border rounded bg-transparent"/></td>
                                        <td className="p-1"><input type="text" defaultValue={result.data[1]} className="w-full p-1 border rounded bg-transparent"/></td>
                                        <td className="p-1"><input type="number" defaultValue={result.data[2]} className="w-20 p-1 border rounded bg-yellow-100 dark:bg-yellow-800/50"/></td>
                                        <td className="p-1"><input type="text" defaultValue={result.data[3]} className="w-full p-1 border rounded bg-transparent"/></td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-2">{result.data[0]}</td>
                                        <td className="p-2">{result.data[1]}</td>
                                        <td className="p-2 text-right">{result.data[2]}</td>
                                        <td className="p-2">{result.data[3]}</td>
                                    </>
                                )}
                                <td className={`p-2 text-xs font-semibold ${result.status === 'error' ? 'text-red-500' : (result.status === 'warning' ? 'text-yellow-600' : 'text-green-500')}`}>{result.message}</td>
                                <td className="p-2">
                                    <div className="flex items-center justify-center gap-1">
                                        {result.status === 'warning' && <button className="p-1 text-blue-600 hover:text-blue-800"><Save size={14} /></button>}
                                        {(result.status === 'error' || result.status === 'warning') && <button className="p-1 text-red-600 hover:text-red-800"><Trash2 size={14} /></button>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <button className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">전체 취소</button>
                <button className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">성공 건만 등록</button>
            </div>
        </div>
    );
};

export default BulkImportResult;
