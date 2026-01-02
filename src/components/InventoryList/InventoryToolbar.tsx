import React from 'react';
import { Search, Plus, FileDown, Printer, LayoutTemplate, RotateCcw, Layers, Tag, Filter } from 'lucide-react';
import { User } from '../../types';

interface InventoryToolbarProps {
  user: User;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedItemName: string;
  setSelectedItemName: (value: string) => void;
  uniqueCategories: string[];
  availableItemNames: string[];
  onAdd: () => void;
  onOpenMonthlyReport: () => void;
  onOpenDBManager: () => void;
  onExportExcel: () => void;
  onShowReport: () => void;
  onResetLayout: () => void;
  onResetDB: () => void;
}

const InventoryToolbar: React.FC<InventoryToolbarProps> = ({
  user,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedItemName,
  setSelectedItemName,
  uniqueCategories,
  availableItemNames,
  onAdd,
  onOpenMonthlyReport,
  onOpenDBManager,
  onExportExcel,
  onShowReport,
  onResetLayout,
  onResetDB
}) => {
  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col 2xl:flex-row justify-between items-start 2xl:items-center gap-3 transition-colors shrink-0 bg-slate-50/50 dark:bg-slate-900">
      {/* Left Side: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full 2xl:w-auto z-20">
        {/* 1. Category Filter */}
        <div className="relative w-full sm:w-40">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <Layers size={14} />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-9 pr-3 py-2 appearance-none border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-slate-200"
          >
            <option value="">전체 대분류</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Filter size={12} className="text-slate-400" />
          </div>
        </div>

        {/* 2. Item Name Filter (Dependent) */}
        <div className="relative w-full sm:w-48">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <Tag size={14} />
          </div>
          <select
            value={selectedItemName}
            onChange={(e) => setSelectedItemName(e.target.value)}
            disabled={!selectedCategory}
            className="w-full pl-9 pr-3 py-2 appearance-none border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
          >
            <option value="">
              {selectedCategory ? '전체 품목' : '대분류를 선택하세요'}
            </option>
            {availableItemNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Filter size={12} className="text-slate-400" />
          </div>
        </div>

        {/* 3. Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="규격, 제조사 등 검색..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center gap-2 w-full 2xl:w-auto justify-end overflow-x-auto pt-2 2xl:pt-0 border-t 2xl:border-t-0 border-slate-200 dark:border-slate-800">
        <button onClick={onOpenMonthlyReport} className="px-3 py-2 text-purple-600 border border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm bg-white dark:bg-slate-800 whitespace-nowrap">
          월별 수불부
        </button>
        <button onClick={onOpenDBManager} className="px-3 py-2 text-slate-600 border border-slate-300 hover:bg-slate-50 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm bg-white dark:bg-slate-800 whitespace-nowrap">
          백업/롤백
        </button>

        <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        <button onClick={onExportExcel} className="px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors border border-slate-300 dark:border-slate-600 shadow-sm bg-white dark:bg-slate-800 whitespace-nowrap">
          <FileDown size={16} /> 엑셀
        </button>
        <button onClick={onShowReport} className="px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors border border-slate-300 dark:border-slate-600 shadow-sm bg-white dark:bg-slate-800 whitespace-nowrap">
          <Printer size={16} /> 보고서
        </button>

        <button onClick={onResetLayout} className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm bg-white dark:bg-slate-800" title="레이아웃 초기화">
          <LayoutTemplate size={16} />
        </button>

        {user.role === 'admin' && (
          <button onClick={onResetDB} className="px-3 py-2 text-red-600 border border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm bg-white dark:bg-slate-800 whitespace-nowrap">
            <RotateCcw size={16} /> DB 초기화
          </button>
        )}

        <button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-colors whitespace-nowrap">
          <Plus size={16} /> 신규 등록
        </button>
      </div>
    </div>
  );
};

export default InventoryToolbar;
