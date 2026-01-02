
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { InventoryItem } from '../../types';

interface Step3ReviewProps {
  previewItems: InventoryItem[];
  importMode: 'standard' | 'cheonan';
  getLabel: (key: string) => string;
  onAnalyzeAndConfirm: () => void;
  onBackToMapping: () => void;
}

const Step3_Review: React.FC<Step3ReviewProps> = ({ 
    previewItems, 
    importMode, 
    getLabel, 
    onAnalyzeAndConfirm, 
    onBackToMapping 
}) => {
    return (
        <div className="flex-1 overflow-auto p-6 flex flex-col h-full">
             <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-slate-600 dark:text-slate-300">
                    {importMode !== 'standard' ? (
                    <span className="flex items-center gap-2 text-blue-600 font-bold">
                        <CheckCircle size={16} /> 
                        {importMode === 'cheonan' ? '천안수질정화센터(레거시)' : '표준'} 양식이 감지되어 자동으로 변환되었습니다.
                    </span>
                    ) : (
                    <span>총 <span className="font-bold text-blue-600 dark:text-blue-400">{previewItems.length}</span>개의 데이터가 변환되었습니다.</span>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-3 py-2 border-b dark:border-slate-700">{getLabel('category')}</th>
                    <th className="px-3 py-2 border-b dark:border-slate-700">{getLabel('name')}</th>
                    <th className="px-3 py-2 border-b dark:border-slate-700 bg-blue-50 dark:bg-blue-900/10 text-xs">{getLabel('standard')}</th>
                    <th className="px-3 py-2 border-b dark:border-slate-700 bg-blue-50 dark:bg-blue-900/10 text-xs">{getLabel('model')}</th>
                    <th className="px-3 py-2 border-b dark:border-slate-700 bg-blue-50 dark:bg-blue-900/10 text-xs">{getLabel('manufacturer')}</th>
                    
                    <th className="px-3 py-2 border-b dark:border-slate-700 font-bold bg-slate-100 dark:bg-slate-700/50">{getLabel('currentStock')}</th>
                    <th className="px-3 py-2 border-b dark:border-slate-700">{getLabel('unit')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {previewItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 group text-slate-700 dark:text-slate-300">
                      <td className="p-2">{item.category}</td>
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-center text-xs">{item.standard}</td>
                      <td className="p-2 text-center text-xs">{item.model}</td>
                      <td className="p-2 text-center text-xs">{item.manufacturer}</td>
                      <td className="p-2 text-right font-bold text-blue-600">{item.currentStock.toFixed(0)}</td>
                      <td className="p-2 text-center">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
               <button 
                 onClick={onAnalyzeAndConfirm} 
                 className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2"
               >
                 <CheckCircle size={18} /> 
                 분석 및 등록
               </button>
               <button 
                  onClick={onBackToMapping} 
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg"
               >
                 {importMode !== 'standard' ? '처음으로' : '매핑 다시하기'}
               </button>
            </div>
        </div>
    );
}

export default Step3_Review;
