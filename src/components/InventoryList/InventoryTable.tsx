import React from 'react';
import { InventoryItem } from '../../types';
import { Edit, AlertCircle, Box } from 'lucide-react';

interface ResizableThProps {
  width: number;
  onResizeStart: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

const ResizableTh: React.FC<ResizableThProps> = ({ width, onResizeStart, children, className = '', align = 'center' }) => (
  <th
    className={`relative px-2 py-3 select-none border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs whitespace-nowrap ${className}`}
    style={{ width, textAlign: align }}
  >
    <div className={`flex items-center h-full truncate ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
      {children}
    </div>
    <div
      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 z-10"
      onMouseDown={onResizeStart}
    />
  </th>
);

interface InventoryTableProps {
  items: InventoryItem[];
  colWidths: Record<string, number>;
  handleMouseDown: (e: React.MouseEvent, key: string) => void;
  getLabel: (key: string, defaultVal: string) => string;
  onEdit: (id: string) => void;
  onTransaction: (item: InventoryItem) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, colWidths, handleMouseDown, getLabel, onEdit, onTransaction }) => {
  return (
    <div className="flex-1 overflow-auto custom-scrollbar relative bg-white dark:bg-slate-900">
      <table className="w-full text-sm text-left table-fixed border-collapse">
        <thead className="sticky top-0 z-10 shadow-sm">
          <tr>
            <ResizableTh width={colWidths.edit} onResizeStart={(e) => handleMouseDown(e, 'edit')} className="text-center"></ResizableTh>
            <ResizableTh width={colWidths.no} onResizeStart={(e) => handleMouseDown(e, 'no')}>No</ResizableTh>
            <ResizableTh width={colWidths.category} onResizeStart={(e) => handleMouseDown(e, 'category')} align="left">{getLabel('category', '대분류')}</ResizableTh>
            <ResizableTh width={colWidths.name} onResizeStart={(e) => handleMouseDown(e, 'name')} align="left">{getLabel('name', '품목명')}</ResizableTh>
            <ResizableTh width={colWidths.standard} onResizeStart={(e) => handleMouseDown(e, 'standard')}>{getLabel('standard', '규격')}</ResizableTh>
            <ResizableTh width={colWidths.model} onResizeStart={(e) => handleMouseDown(e, 'model')}>{getLabel('model', '품번(비고)')}</ResizableTh>
            <ResizableTh width={colWidths.manufacturer} onResizeStart={(e) => handleMouseDown(e, 'manufacturer')}>{getLabel('manufacturer', '제조사')}</ResizableTh>
            <ResizableTh width={colWidths.currentStock} onResizeStart={(e) => handleMouseDown(e, 'currentStock')} align="right">{getLabel('currentStock', '재고')}</ResizableTh>
            <ResizableTh width={colWidths.unit} onResizeStart={(e) => handleMouseDown(e, 'unit')}>{getLabel('unit', '단위')}</ResizableTh>
            <ResizableTh width={colWidths.location} onResizeStart={(e) => handleMouseDown(e, 'location')}>{getLabel('location', '보관장소')}</ResizableTh>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((item, index) => {
            const isLowStock = item.currentStock < item.safeStock;
            return (
              <tr
                key={item.id}
                className="hover:bg-blue-50 dark:hover:bg-blue-900/10 group cursor-pointer transition-colors"
                onClick={() => onTransaction(item)}
              >
                <td className="px-2 py-3 text-center border-r border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-800 relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onEdit(item.id)}
                    className="p-1.5 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors shadow-sm"
                    title="품목 수정"
                  >
                    <Edit size={14} strokeWidth={2.5} />
                  </button>
                </td>
                <td className="px-2 py-3 text-center text-slate-400 font-mono text-xs border-r border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-800">
                  {index + 1}
                </td>
                <td className="px-3 py-3 text-slate-600 dark:text-slate-400 truncate border-r border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-800">
                  {item.category}
                </td>
                <td className="px-3 py-3 font-bold text-slate-800 dark:text-slate-200 truncate border-r border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-800">
                  {item.name}
                </td>
                <td className="px-2 py-3 text-center text-slate-500 text-xs truncate border-r border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-800">
                  {item.standard}
                </td>
                <td className="px-2 py-3 text-center text-slate-500 text-xs truncate border-r border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-800">
                  {item.model}
                </td>
                <td className="px-2 py-3 text-center text-slate-500 text-xs truncate border-r border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-800">
                  {item.manufacturer}
                </td>
                <td className="px-3 py-3 text-right border-r border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-800">
                  <div className={`flex items-center justify-end gap-1.5 ${isLowStock ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-800 dark:text-slate-200 font-bold'}`}>
                    <span className="text-base">{item.currentStock.toLocaleString()}</span>
                    {isLowStock && <AlertCircle size={14} className="text-red-500 animate-pulse" />}
                  </div>
                </td>
                <td className="px-2 py-3 text-center text-slate-500 text-xs border-r border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-800">
                  {item.unit}
                </td>
                <td className="px-3 py-3 text-center text-slate-500 text-xs truncate border-r border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-800">
                  {item.location}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="text-center py-20 text-slate-400 flex flex-col items-center">
          <Box size={48} className="mb-4 text-slate-300 dark:text-slate-700" strokeWidth={1} />
          <p className="text-lg font-medium">검색 결과가 없습니다.</p>
          <p className="text-sm mt-1">대분류 및 품목 필터를 확인해보세요.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
