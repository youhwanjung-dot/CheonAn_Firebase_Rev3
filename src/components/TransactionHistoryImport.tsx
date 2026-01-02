import React, { useState, useRef } from 'react';
import { read, utils, WorkSheet } from 'xlsx';
import { Upload, CheckCircle, FileSpreadsheet, Calendar, AlertCircle } from 'lucide-react';
import { InventoryItem, InventoryTransaction } from '../types';
import { ActionLogger } from '../utils/logger';

interface TransactionHistoryImportProps {
  onImport: (transactions: InventoryTransaction[]) => void;
  onCancel: () => void;
  inventory: InventoryItem[];
}

interface FailedRecord {
  rowIndex: number;
  name: string;
  standard: string;
  reason: string;
}

const TransactionHistoryImport: React.FC<TransactionHistoryImportProps> = ({ onImport, onCancel, inventory }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [targetMonth, setTargetMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [previewTransactions, setPreviewTransactions] = useState<InventoryTransaction[]>([]);
  const [matchStats, setMatchStats] = useState({ success: 0, failed: 0 });
  const [failedRecords, setFailedRecords] = useState<FailedRecord[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanNumber = (val: string | number | null | undefined): number => {
    if (typeof val === 'number') return Math.round(val);
    if (!val) return 0;
    const strVal = String(val).replace(/,/g, '').trim();
    const num = parseFloat(strVal);
    return isNaN(num) ? 0 : Math.round(num);
  };

  const resolveMergedCells = (ws: WorkSheet) => {
    if (!ws['!merges']) return;
    ws['!merges'].forEach((merge) => {
      const startRef = utils.encode_cell(merge.s);
      const startCell = ws[startRef];
      if (startCell) {
        for (let r = merge.s.r; r <= merge.e.r; r++) {
          for (let c = merge.s.c; c <= merge.e.c; c++) {
            const targetRef = utils.encode_cell({ c, r });
            if (!ws[targetRef]) {
              ws[targetRef] = { ...startCell };
            }
          }
        }
      }
    });
    delete ws['!merges'];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        resolveMergedCells(ws);

        const data = utils.sheet_to_json(ws, { header: 1 }) as unknown[][];
        processLegacyHistory(data);
      };
      reader.readAsBinaryString(uploadedFile);
    }
  };

  const processLegacyHistory = (data: unknown[][]) => {
    // 1. Find Header Row (Specific to Cheonan Legacy Format)
    const headerRowIndex = data.findIndex(row => 
      (row as unknown[]).some((cell: unknown) => String(cell).includes('품목(규격)')) &&
      (row as unknown[]).some((cell: unknown) => String(cell).includes('입고')) &&
      (row as unknown[]).some((cell: unknown) => String(cell).includes('출고'))
    );

    if (headerRowIndex === -1) {
      alert('천안수질정화센터 양식(품목, 입고, 출고 포함)을 찾을 수 없습니다.');
      return;
    }

    const headerRow = data[headerRowIndex] as string[];
    const normalize = (s: string | null | undefined) => String(s || '').replace(/\s/g, '');
    const findIndex = (keywords: string[]) => 
        headerRow.findIndex((cell) => keywords.some(k => normalize(cell).includes(k)));

    const colIdx = {
      nameSpec: findIndex(['품목(규격)', '품목']),
      inQty: findIndex(['입고']),
      outQty: findIndex(['출고']),
    };

    if (colIdx.nameSpec === -1 || colIdx.inQty === -1 || colIdx.outQty === -1) {
       alert('필수 컬럼(품목, 입고, 출고)을 식별할 수 없습니다.');
       return;
    }

    const newTransactions: InventoryTransaction[] = [];
    const errors: FailedRecord[] = [];
    let matchedCount = 0;
    let failedCount = 0;

    // Use selected month's 1st day for IN, 28th for OUT (Arbitrary logic for summary data)
    const dateIn = `${targetMonth}-01`;
    const dateOut = `${targetMonth}-28`;

    for (let i = headerRowIndex + 1; i < data.length; i++) {
      const row = data[i] as unknown[];
      if (!row || row.length === 0) continue;

      const rawNameSpec = row[colIdx.nameSpec];
      const nameSpec = rawNameSpec ? String(rawNameSpec).trim() : '';
      
      // Skip headers/subtotals
      if (['품목', '합계', '소계'].some(k => nameSpec.includes(k))) continue;
      if (!nameSpec) continue;

      // Split Name & Standard
      let name = nameSpec;
      let standard = '';
      
      // Changed to index-based parsing to handle nested parentheses
      // Logic: Everything before the *first* '(' is the Name. Everything inside the outer '(...)' is Standard.
      const pStart = nameSpec.indexOf('(');
      const pEnd = nameSpec.lastIndexOf(')');
      
      if (pStart > -1 && pEnd === nameSpec.length - 1) {
          name = nameSpec.substring(0, pStart).trim();
          standard = nameSpec.substring(pStart + 1, pEnd).trim();
      }

      // Find matching item in DB
      // Matching Logic: Name AND Standard must match
      // Uses replace(/\s/g, '') to ignore spaces completely during comparison
      const targetItem = inventory.find(item => {
         const itemNameNorm = item.name.replace(/\s/g, '');
         const targetNameNorm = name.replace(/\s/g, '');
         
         const itemStdNorm = item.standard.replace(/\s/g, '');
         const targetStdNorm = standard.replace(/\s/g, '');
         
         return itemNameNorm === targetNameNorm && itemStdNorm === targetStdNorm;
      });

      if (!targetItem) {
        errors.push({
            rowIndex: i + 1,
            name: name,
            standard: standard,
            reason: '품목 미등록 (이름/규격 불일치)'
        });
        failedCount++;
        continue;
      }

      matchedCount++;
      const inQty = cleanNumber(row[colIdx.inQty] as string);
      const outQty = cleanNumber(row[colIdx.outQty] as string);

      // Create IN Transaction
      if (inQty > 0) {
        newTransactions.push({
          id: `HIST-IN-${Date.now()}-${i}`,
          itemId: targetItem.id,
          itemName: targetItem.name,
          category: targetItem.category,
          date: dateIn,
          type: 'IN',
          quantity: inQty,
          worker: '시스템',
          department: '관리팀',
          reason: '구매입고(이력복원)',
          currentStockSnapshot: 0 // Snapshot is irrelevant for history import, handled by logger or recalculation
        });
      }

      // Create OUT Transaction
      if (outQty > 0) {
        newTransactions.push({
          id: `HIST-OUT-${Date.now()}-${i}`,
          itemId: targetItem.id,
          itemName: targetItem.name,
          category: targetItem.category,
          date: dateOut,
          type: 'OUT',
          quantity: outQty,
          worker: '시스템',
          department: '현장',
          reason: '현장사용(이력복원)',
          currentStockSnapshot: 0
        });
      }
    }

    setPreviewTransactions(newTransactions);
    setMatchStats({ success: matchedCount, failed: failedCount });
    setFailedRecords(errors);
    setStep(2);
  };

  const handleConfirm = () => {
    ActionLogger.log('History Import Confirmed', { count: previewTransactions.length, month: targetMonth });
    onImport(previewTransactions);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-full flex flex-col animate-fade-in transition-colors relative">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="text-purple-600 dark:text-purple-400" />
            수불부(입출고 이력) 일괄 등록
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            월별 현황 파일에서 &apos;입고&apos; 및 &apos;출고&apos; 수량을 추출하여 이력을 생성합니다.
          </p>
        </div>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          취소
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-8">
             {/* Month Selector */}
             <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
               <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                 1. 대상 월 선택 (YYYY-MM)
               </label>
               <div className="flex items-center gap-3">
                 <input 
                   type="month" 
                   value={targetMonth}
                   onChange={(e) => setTargetMonth(e.target.value)}
                   className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                 />
                 <span className="text-xs text-slate-500 dark:text-slate-400">
                   * 선택한 월의 데이터로 이력이 생성됩니다.
                 </span>
               </div>
             </div>

             {/* File Upload */}
             <div 
               className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer py-12"
               onClick={() => fileInputRef.current?.click()}
             >
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <div className="bg-white dark:bg-slate-700 p-4 rounded-full shadow-sm mb-4">
                  <Upload size={32} className="text-purple-500 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">2. 엑셀 파일 업로드</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm text-center">
                  천안수질정화센터 현황 파일 (.xlsx)<br/>
                  (품목, 규격, 입고, 출고 컬럼이 포함되어야 합니다)
                </p>
             </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col h-full max-w-4xl mx-auto">
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-500" /> 분석 결과 요약
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                   <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-500">생성될 이력</p>
                      <p className="text-2xl font-bold text-blue-600">{previewTransactions.length}건</p>
                   </div>
                   <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-500">품목 매칭 성공</p>
                      <p className="text-2xl font-bold text-green-600">{matchStats.success}개</p>
                   </div>
                   <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-500">매칭 실패 (누락)</p>
                      <p className="text-2xl font-bold text-red-500">{matchStats.failed}개</p>
                   </div>
                </div>
             </div>

            {/* Error Details Section */}
            {failedRecords.length > 0 && (
                <div className="flex-1 min-h-0 mb-6 flex flex-col border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 rounded-lg p-4">
                    <h4 className="font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2 shrink-0">
                        <AlertCircle size={16} /> 매칭 실패 상세 내역 ({failedRecords.length}건)
                    </h4>
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-800 rounded border border-red-100 dark:border-red-900/30">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 font-bold text-xs sticky top-0">
                                <tr>
                                    <th className="px-3 py-2 w-16">행(Row)</th>
                                    <th className="px-3 py-2">엑셀 품목명</th>
                                    <th className="px-3 py-2">엑셀 규격</th>
                                    <th className="px-3 py-2">사유</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-red-100 dark:divide-slate-700">
                                {failedRecords.map((err, idx) => (
                                    <tr key={idx} className="hover:bg-red-50/50 dark:hover:bg-red-900/10 text-slate-700 dark:text-slate-300">
                                         <td className="px-3 py-1.5 text-slate-500 dark:text-slate-500 text-xs">{err.rowIndex}</td>
                                         <td className="px-3 py-1.5">{err.name}</td>
                                         <td className="px-3 py-1.5 text-xs font-mono">{err.standard}</td>
                                         <td className="px-3 py-1.5 text-red-600 dark:text-red-400 text-xs">{err.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

             <div className="flex justify-end gap-3 shrink-0">
                <button 
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg"
                >
                  뒤로가기
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={previewTransactions.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileSpreadsheet size={18} />
                  이력 등록 실행
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryImport;