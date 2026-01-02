import { Upload, Download, FileText, MoveRight } from 'lucide-react';

const BulkImportUI = () => {
    const sourceColumns = ['품목코드', '품목명', '수량', '입고일자'];
    const targetFields = ['품목 ID', '수량', '입고일', '단위', '거래처'];

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm font-sans text-xs space-y-4">
            {/* Step 1: Upload File */}
            <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-2">1. 파일 업로드</h4>
                <div className="flex items-center justify-between p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Upload size={32} className="text-slate-400"/>
                        <div>
                             <p className="font-semibold text-slate-800 dark:text-slate-100">업로드할 파일을 드래그하거나 클릭하세요.</p>
                             <p className="text-slate-500"> (XLSX, CSV 형식 지원)</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition text-xs">
                        <Download size={14} />
                        <span>양식 다운로드</span>
                    </button>
                </div>
            </div>

             {/* Step 2: Column Mapping */}
            <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-2">2. 컬럼 매핑</h4>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                     <div className="grid grid-cols-3 gap-4 items-center">
                        {/* Source Columns */}
                        <div className="col-span-1">
                             <p className="font-semibold mb-2 text-center text-slate-600 dark:text-slate-300">파일 컬럼 (원본)</p>
                             <div className="space-y-2">
                                {sourceColumns.map(col => (
                                    <div key={col} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md">
                                        <FileText size={14} className="text-slate-400"/>
                                        <span className="font-medium text-slate-800 dark:text-slate-100">{col}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Arrow Icon */}
                         <div className="col-span-1 flex justify-center">
                             <MoveRight size={24} className="text-slate-400" />
                        </div>

                        {/* Target Fields */}
                        <div className="col-span-1">
                            <p className="font-semibold mb-2 text-center text-slate-600 dark:text-slate-300">시스템 필드 (대상)</p>
                            <div className="space-y-2">
                                {targetFields.slice(0, 4).map(field => (
                                    <select key={field} defaultValue={field} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                                        <option value="" disabled>선택...</option>
                                        {targetFields.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Action Button */}
            <div className="flex justify-end pt-2">
                 <button className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition">유효성 검사</button>
            </div>
        </div>
    );
};

export default BulkImportUI;
