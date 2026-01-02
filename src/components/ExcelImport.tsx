
import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import { FileSpreadsheet, ArrowRight } from 'lucide-react';
import { InventoryItem, Category } from '../types';
import { ActionLogger } from '../utils/logger';
import { DEFAULT_DB_FIELDS, FIELD_SETTINGS_KEY, FieldDef } from '../constants';

import Step1Upload from './ExcelImport/Step1_Upload';
import Step2Mapping from './ExcelImport/Step2_Mapping';
import Step3Review from './ExcelImport/Step3_Review';
import AnalysisModal from './ExcelImport/AnalysisModal';
import {
  cleanNumber,
  resolveMergedCells,
  processCheonanLegacyFormat,
  guessMapping,
} from './ExcelImport/utils';

interface ExcelImportProps {
  onImport: (items: InventoryItem[]) => void;
  onCancel: () => void;
  currentInventory: InventoryItem[];
}

type FieldMapping = {
  [key in keyof Omit<InventoryItem, 'id' | 'lastUpdated'>]?: string;
};

const ExcelImport: React.FC<ExcelImportProps> = ({ onImport, onCancel, currentInventory }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<unknown[]>([]);
  const [mapping, setMapping] = useState<FieldMapping>({});
  const [previewItems, setPreviewItems] = useState<InventoryItem[]>([]);
  const [importMode, setImportMode] = useState<'standard' | 'cheonan'>('standard');

  const [dbFields, setDbFields] = useState<FieldDef[]>(() => {
    try {
      const saved = localStorage.getItem(FIELD_SETTINGS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_DB_FIELDS;
    } catch {
      return DEFAULT_DB_FIELDS;
    }
  });

  const [editingFieldKey, setEditingFieldKey] = useState<string | null>(null);
  const [tempLabel, setTempLabel] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

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
        
        if (data.length > 0) {
          const headerRowIdx = data.findIndex(row => 
            (row as unknown[]).some(cell => String(cell).includes('품목(규격)'))
          );
          
          let isLegacyFormat = false;
          if (headerRowIdx !== -1) {
             const headerRow = data[headerRowIdx] as string[];
             const hasStandardCol = headerRow.some(cell => String(cell).trim() === '규격');
             const hasStockCol = headerRow.some(cell => String(cell).trim().includes('재고'));
             
             if (!hasStandardCol && hasStockCol) {
                isLegacyFormat = true;
             }
          }

          if (isLegacyFormat) {
             const items = processCheonanLegacyFormat(data, headerRowIdx);
             if (items) {
                setPreviewItems(items);
                setImportMode('cheonan');
                setStep(3); 
                return;
             }
          }

          setImportMode('standard');
          const headers = data[0] as string[];
          const rows = data.slice(1);
          setExcelHeaders(headers);
          setRawRows(rows as unknown[]);
          setMapping(guessMapping(headers));
          setStep(2);
        }
      };
      reader.readAsBinaryString(uploadedFile);
    }
  };

  const handleMappingChange = (dbField: string, excelHeader: string) => {
    setMapping(prev => ({ ...prev, [dbField]: excelHeader }));
  };

  const startEditingLabel = (field: FieldDef) => {
    setEditingFieldKey(field.key);
    setTempLabel(field.label);
  };

  const saveLabelEdit = () => {
    if (editingFieldKey && tempLabel.trim()) {
      const newFields = dbFields.map(f => 
        f.key === editingFieldKey ? { ...f, label: tempLabel.trim() } : f
      );
      setDbFields(newFields);
      localStorage.setItem(FIELD_SETTINGS_KEY, JSON.stringify(newFields));
    }
    setEditingFieldKey(null);
  };

  const resetLabels = () => {
    if (window.confirm('필드 명칭을 기본값으로 초기화하시겠습니까?')) {
      setDbFields(DEFAULT_DB_FIELDS);
      localStorage.removeItem(FIELD_SETTINGS_KEY);
    }
  };

  const cancelLabelEdit = () => {
    setEditingFieldKey(null);
  };

  const generatePreview = () => {
    const missingRequired = dbFields.filter(f => f.required && !mapping[f.key as keyof FieldMapping]);
    if (missingRequired.length > 0) {
      alert(`다음 필수 필드가 매핑되지 않았습니다: ${missingRequired.map(f => f.label).join(', ')}`);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const items: InventoryItem[] = rawRows.map((row, index: number) => {
      const rowArray = row as unknown[];
      const rowObj: { [key: string]: unknown } = {};
      excelHeaders.forEach((h, i) => {
        rowObj[h] = rowArray[i];
      });

      const getValue = (key: keyof FieldMapping) => {
        const header = mapping[key];
        return header ? rowObj[header] : undefined;
      };

      const categoryRaw = getValue('category');
      const category = categoryRaw ? String(categoryRaw).trim() : Category.ELECTRIC;

      return {
        id: `IMP-${Date.now()}-${index}`,
        lastUpdated: today,
        category: category as Category,
        name: String(getValue('name') || '이름 없음'),
        standard: String(getValue('standard') || ''),
        model: String(getValue('model') || ''),
        manufacturer: String(getValue('manufacturer') || ''),
        unit: String(getValue('unit') || 'EA'),
        currentStock: cleanNumber(getValue('currentStock')),
        safeStock: Math.max(1, cleanNumber(getValue('safeStock') || 1)),
        location: String(getValue('location') || ''),
        note: String(getValue('note') || '')
      };
    });

    setPreviewItems(items);
    setStep(3);
  };

  const handleFinalConfirm = () => {
    ActionLogger.log('Excel Import Confirmed', { count: previewItems.length, mode: importMode });
    onImport(previewItems);
    setShowAnalysis(false);
  };

  const duplicateCount = previewItems.filter(p => 
    currentInventory.some(c => c.name === p.name && c.standard === p.standard)
  ).length;

  const getLabel = (key: string) => dbFields.find(f => f.key === key)?.label || key;

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Upload onFileUpload={handleFileUpload} onCancel={onCancel}/>;
      case 2:
        return (
          <Step2Mapping
            dbFields={dbFields}
            mapping={mapping}
            excelHeaders={excelHeaders}
            editingFieldKey={editingFieldKey}
            tempLabel={tempLabel}
            onMappingChange={handleMappingChange}
            onStartEditingLabel={startEditingLabel}
            onSaveLabelEdit={saveLabelEdit}
            onCancelLabelEdit={cancelLabelEdit}
            onSetTempLabel={setTempLabel}
            onResetLabels={resetLabels}
            onGeneratePreview={generatePreview}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        return (
          <Step3Review
            previewItems={previewItems}
            importMode={importMode}
            getLabel={getLabel}
            onAnalyzeAndConfirm={() => setShowAnalysis(true)}
            onBackToMapping={() => {
              setStep(importMode === 'cheonan' ? 1 : 2);
              if(importMode === 'cheonan') setImportMode('standard');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-full flex flex-col animate-fade-in overflow-hidden transition-colors relative">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="text-green-600 dark:text-green-400" />
            현재고 일괄등록
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            재고 현황 데이터를 엑셀로 업로드하여 등록합니다. (기존 데이터와 병합 또는 신규 등록)
          </p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center text-sm font-medium mr-4">
             <span className={`px-2 py-1 rounded ${step === 1 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-slate-400 dark:text-slate-600'}`}>1. 업로드</span>
             <ArrowRight size={14} className="mx-1 text-slate-300 dark:text-slate-600" />
             <span className={`px-2 py-1 rounded ${step === 2 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-slate-400 dark:text-slate-600'}`}>2. 필드연결</span>
             <ArrowRight size={14} className="mx-1 text-slate-300 dark:text-slate-600" />
             <span className={`px-2 py-1 rounded ${step === 3 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-slate-400 dark:text-slate-600'}`}>3. 검토/저장</span>
           </div>
           {step === 1 && <button onClick={onCancel} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">취소</button>}
        </div>
      </div>

      {renderStep()}

      {showAnalysis && (
        <AnalysisModal 
          itemCount={previewItems.length}
          duplicateCount={duplicateCount}
          onConfirm={handleFinalConfirm}
          onCancel={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
};

export default ExcelImport;
