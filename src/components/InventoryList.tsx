import React, { useState, useMemo, useRef, useEffect } from 'react';
import { InventoryItem, User } from '../types';
import { utils, writeFile } from 'xlsx';
import { ActionLogger } from '../utils/logger';
import { DEFAULT_DB_FIELDS, FIELD_SETTINGS_KEY } from '../constants';
import InventoryToolbar from './InventoryList/InventoryToolbar';
import InventoryTable from './InventoryList/InventoryTable';
import InventoryModals from './InventoryList/InventoryModals';

interface InventoryListProps {
  items: InventoryItem[];
  user: User;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReset: () => void;
  onOpenDBManager: () => void;
  onTransaction: (item: InventoryItem) => void;
  onOpenMonthlyReport: () => void;
}

const WIDTH_STORAGE_KEY = 'cheonan_inventory_col_widths_v2';

const DEFAULT_WIDTHS = {
  edit: 50,
  no: 60,
  category: 100,
  name: 240,
  standard: 120, 
  model: 120,
  manufacturer: 100,
  currentStock: 100,
  unit: 80,
  location: 120,
};

const InventoryList: React.FC<InventoryListProps> = ({ items, user, onAdd, onEdit, onReset, onTransaction, onOpenDBManager, onOpenMonthlyReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItemName, setSelectedItemName] = useState<string>('');
  const [showReport, setShowReport] = useState(false);
  const [showLayoutReset, setShowLayoutReset] = useState(false);
  const [labels, setLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    let fields = DEFAULT_DB_FIELDS;
    try {
      const saved = localStorage.getItem(FIELD_SETTINGS_KEY);
      if (saved) fields = JSON.parse(saved);
    } catch {}

    const labelMap: Record<string, string> = {};
    fields.forEach(f => {
      const cleanLabel = f.label.replace(/^\d+\.\s*/, '').replace(/\(.*\)/, '').trim();
      labelMap[f.key] = cleanLabel || f.label; 
    });
    setLabels(labelMap);
  }, []);

  const getLabel = (key: string, defaultVal: string) => labels[key] || defaultVal;

  const [colWidths, setColWidths] = useState<typeof DEFAULT_WIDTHS>(() => {
    try {
      const saved = localStorage.getItem(WIDTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_WIDTHS;
    } catch {
      return DEFAULT_WIDTHS;
    }
  });

  useEffect(() => {
    localStorage.setItem(WIDTH_STORAGE_KEY, JSON.stringify(colWidths));
  }, [colWidths]);

  const resizingRef = useRef<{ key: string; startX: number; startWidth: number } | null>(null);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(items.map(i => i.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [items]);

  const availableItemNames = useMemo(() => {
    if (!selectedCategory) return [];
    const names = new Set(
        items
        .filter(i => i.category === selectedCategory)
        .map(i => i.name)
        .filter(Boolean)
    );
    return Array.from(names).sort();
  }, [items, selectedCategory]);

  useEffect(() => {
    setSelectedItemName('');
  }, [selectedCategory]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (item.standard || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.manufacturer || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
      const matchesName = selectedItemName === '' || item.name === selectedItemName;
      
      return matchesSearch && matchesCategory && matchesName;
    });
  }, [items, searchTerm, selectedCategory, selectedItemName]);

  const handleMouseDown = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    resizingRef.current = {
      key,
      startX: e.clientX,
      startWidth: colWidths[key as keyof typeof colWidths]
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!resizingRef.current) return;
    const { key, startX, startWidth } = resizingRef.current;
    const diff = e.clientX - startX;
    setColWidths(prev => ({
      ...prev,
      [key]: Math.max(40, startWidth + diff)
    }));
  };

  const handleMouseUp = () => {
    resizingRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleExportExcel = () => {
    ActionLogger.log('Excel Export Initiated');
    const exportData = filteredItems.map((item, index) => ({
      'No': index + 1,
      [getLabel('category', '대분류')]: item.category,
      [getLabel('name', '품목명')]: item.name,
      [getLabel('standard', '규격')]: item.standard,
      [getLabel('model', '품번(비고)')]: item.model,
      [getLabel('manufacturer', '제조사')]: item.manufacturer,
      [getLabel('currentStock', '재고')]: item.currentStock,
      [getLabel('unit', '단위')]: item.unit,
      [getLabel('safeStock', '적정재고')]: item.safeStock,
      [getLabel('location', '보관장소')]: item.location,
      [getLabel('note', '기타사항')]: item.note
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "재고현황");
    
    const wscols = Object.keys(exportData[0] || {}).map(() => ({ wch: 15 }));
    ws['!cols'] = wscols;

    const dateStr = new Date().toISOString().slice(0, 10);
    writeFile(wb, `천안수질정화센터_전기자재_재고현황_${dateStr}.xlsx`);
  };

  const handleResetLayoutRequest = () => {
    setShowLayoutReset(true);
  };

  const handleResetLayoutConfirm = () => {
    setColWidths(DEFAULT_WIDTHS);
    setShowLayoutReset(false);
    ActionLogger.log('Layout Reset');
  };

  const handleResetClick = () => {
    if (user.role !== 'admin') {
      alert('관리자 권한이 필요합니다.');
      return;
    }
    onReset();
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full animate-fade-in transition-colors">
        <InventoryToolbar
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedItemName={selectedItemName}
          setSelectedItemName={setSelectedItemName}
          uniqueCategories={uniqueCategories}
          availableItemNames={availableItemNames}
          onAdd={onAdd}
          onOpenMonthlyReport={onOpenMonthlyReport}
          onOpenDBManager={onOpenDBManager}
          onExportExcel={handleExportExcel}
          onShowReport={() => setShowReport(true)}
          onResetLayout={handleResetLayoutRequest}
          onResetDB={handleResetClick}
        />
        <InventoryTable
          items={filteredItems}
          colWidths={colWidths}
          handleMouseDown={handleMouseDown}
          getLabel={getLabel}
          onEdit={onEdit}
          onTransaction={onTransaction}
        />
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 text-xs">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-slate-600 dark:text-slate-400">
                   <strong className="text-red-600 dark:text-red-400">붉은색 숫자</strong>는 적정재고 미달 품목입니다. (아이콘 클릭: 수정, 행 클릭: 입출고)
                </span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                <div className="pl-4 border-l border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
                   총 {items.length}개 품목
                </div>
            </div>
        </div>
      </div>

      <InventoryModals
        showReport={showReport}
        setShowReport={setShowReport}
        filteredItems={filteredItems}
        colWidths={colWidths}
        showLayoutReset={showLayoutReset}
        setShowLayoutReset={setShowLayoutReset}
        handleResetLayoutConfirm={handleResetLayoutConfirm}
      />
    </>
  );
};

export default InventoryList;
