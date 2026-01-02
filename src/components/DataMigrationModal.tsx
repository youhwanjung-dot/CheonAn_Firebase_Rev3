import React, { useRef, useState } from 'react';
import { X, /*Download,*/ Upload, History, AlertTriangle, CheckCircle, Save } from 'lucide-react';
import { InventoryItem, InventoryTransaction } from '../types';
import { ActionLogger } from '../utils/logger';
import { APP_VERSION } from '../constants';
import ConfirmationModal from './ConfirmationModal';

interface DataMigrationModalProps {
  items: InventoryItem[];
  transactions: InventoryTransaction[];
  onImport: (data: { inventory: InventoryItem[], transactions: InventoryTransaction[] }) => void;
  onClose: () => void;
}

const DataMigrationModal: React.FC<DataMigrationModalProps> = ({ items, transactions, onImport, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // State for rollback confirmation modal
  const [showRollbackConfirm, setShowRollbackConfirm] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [pendingImportData, setPendingImportData] = useState<{ inventory: InventoryItem[], transactions: InventoryTransaction[] } | null>(null);

  const handleExport = () => {
    try {
      const backupData = {
        version: APP_VERSION,
        date: new Date().toISOString(),
        inventory: items,
        transactions: transactions
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      // Includes timestamp in filename for better version control
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      link.download = `천안수질정화센터_통합백업_${dateStr}_v${APP_VERSION}.json`; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ text: '재고 및 이력 데이터가 파일로 저장되었습니다.', type: 'success' });
      ActionLogger.log('Full DB Exported to File');
    } catch {
      setMessage({ text: '파일 저장 중 오류가 발생했습니다.', type: 'error' });
    }
  };

  const handleRollbackClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name); // Store filename for display
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const result = evt.target?.result as string;
        const parsedData = JSON.parse(result);
        
        let inventoryData: InventoryItem[] = [];
        let transactionData: InventoryTransaction[] = [];

        // Determine format: Legacy (Array) or New (Object with keys)
        if (Array.isArray(parsedData)) {
          // Legacy format (Inventory Item Array only)
          inventoryData = parsedData;
          // Warning: Legacy backup doesn't have transactions. 
          // We will pass empty transactions or keep existing? 
          // Logic: "Rollback" implies restoring state to that file. If file has no history, history is empty.
          transactionData = []; 
        } else if (parsedData.inventory && Array.isArray(parsedData.inventory)) {
          // New format
          inventoryData = parsedData.inventory;
          transactionData = Array.isArray(parsedData.transactions) ? parsedData.transactions : [];
        } else {
           throw new Error("Invalid format");
        }
        
        if (inventoryData.length > 0 && 'id' in inventoryData[0]) {
          setPendingImportData({ inventory: inventoryData, transactions: transactionData });
          setShowRollbackConfirm(true); 
        } else {
          setMessage({ text: '올바르지 않은 백업 파일 형식입니다.', type: 'error' });
          setSelectedFileName(null);
          setPendingImportData(null);
        }
      } catch {
        setMessage({ text: '파일을 읽는 중 오류가 발생했습니다. 올바른 JSON 백업 파일인지 확인해주세요.', type: 'error' });
        setSelectedFileName(null);
        setPendingImportData(null);
      } finally {
        // Clear input so same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const executeRollback = () => {
    if (pendingImportData) {
      onImport(pendingImportData);
      setMessage({ text: '데이터가 성공적으로 롤백(복원)되었습니다.', type: 'success' });
      ActionLogger.log('DB Rollback Performed', { 
        items: pendingImportData.inventory.length, 
        transactions: pendingImportData.transactions.length 
      });
    }
    setShowRollbackConfirm(false);
    setSelectedFileName(null);
    setPendingImportData(null);
    setTimeout(onClose, 2000); 
  };

  const cancelRollbackConfirm = () => {
    setShowRollbackConfirm(false);
    setSelectedFileName(null);
    setPendingImportData(null);
    setMessage({ text: '데이터 복원이 취소되었습니다.', type: 'error' });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <History className="text-indigo-600 dark:text-indigo-400" size={24} />
            시스템 백업 및 롤백
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg text-sm text-indigo-900 dark:text-indigo-300 flex items-start gap-3 border border-indigo-100 dark:border-indigo-800">
             <AlertTriangle size={20} className="shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
             <div>
               <p className="font-bold mb-1">통합 데이터 관리</p>
               <p>
                 <strong>[전체 백업]</strong> 시 현재 재고와 모든 입출고 이력이 하나의 파일로 저장됩니다.<br/>
                 복원 시 해당 시점의 데이터로 완전히 되돌아갑니다.
               </p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Backup Button */}
            <button 
              onClick={handleExport}
              className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-slate-200 dark:border-slate-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:border-blue-500 transition-all group"
            >
              <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-800 transition-colors">
                <Save size={24} className="text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-300" />
              </div>
              <div className="text-center">
                <span className="block font-bold text-slate-800 dark:text-slate-100">전체 백업 (Export)</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">재고+이력 다운로드</span>
              </div>
            </button>

            {/* Rollback Button */}
            <button 
              onClick={handleRollbackClick}
              className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-slate-200 dark:border-slate-600 rounded-xl hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:border-red-500 transition-all group"
            >
              <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full group-hover:bg-red-100 dark:group-hover:bg-red-800 transition-colors">
                <Upload size={24} className="text-slate-600 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-300" />
              </div>
              <div className="text-center">
                <span className="block font-bold text-red-700 dark:text-red-400">데이터 복원 (Import)</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">백업 파일 업로드</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json" 
                className="hidden" 
              />
            </button>
          </div>

          {message && (
            <div className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium animate-fade-in ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {message.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              {message.text}
            </div>
          )}
        </div>
      </div>

      {showRollbackConfirm && (
        <ConfirmationModal
          title="데이터 복원 (경고)"
          message={
            <div className="space-y-2">
              <p className="font-bold text-red-600 dark:text-red-400">주의: 현재 데이터가 덮어씌워집니다!</p>
              <p>선택하신 백업 파일(<strong className="text-slate-800 dark:text-slate-100">{selectedFileName}</strong>)로 시스템을 복원합니다.</p>
              <ul className="list-disc list-inside text-xs text-slate-500 dark:text-slate-400 mt-2">
                 <li>재고 품목: {pendingImportData?.inventory.length}개</li>
                 <li>입출고 이력: {pendingImportData?.transactions.length}건</li>
              </ul>
              <p className="mt-2">복원을 진행하시겠습니까?</p>
            </div>
          }
          confirmLabel="복원 실행"
          cancelLabel="취소"
          isDangerous={true}
          onConfirm={executeRollback}
          onCancel={cancelRollbackConfirm}
        />
      )}
    </div>
  );
};

export default DataMigrationModal;