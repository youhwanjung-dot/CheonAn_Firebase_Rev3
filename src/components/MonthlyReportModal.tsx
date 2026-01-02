import React, { useMemo, useState, useRef } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { InventoryItem, InventoryTransaction } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { APP_VERSION } from '../constants';

interface MonthlyReportModalProps {
  items: InventoryItem[];
  transactions: InventoryTransaction[];
  onClose: () => void;
}

const ROWS_PER_PAGE = 35;

// A more specific type for the data used in the report
type ReportItem = InventoryItem & {
  startStock: number;
  totalIn: number;
  totalOut: number;
  endStock: number;
};

const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({ items, transactions, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // --- Report Data Calculation ---
  const reportData: ReportItem[] = useMemo(() => {
    const startDate = `${selectedMonth}-01`;
    const [year, month] = selectedMonth.split('-').map(Number);
    const nextMonthDate = new Date(year, month, 1);
    const nextMonthStr = nextMonthDate.toISOString().slice(0, 10);

    const calculated = items.map(item => {
      const itemTrans = transactions.filter(t => t.itemId === item.id);
      
      const monthTrans = itemTrans.filter(t => t.date >= startDate && t.date < nextMonthStr);
      const totalIn = monthTrans.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.quantity, 0);
      const totalOut = monthTrans.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.quantity, 0);

      const futureTrans = itemTrans.filter(t => t.date >= nextMonthStr);
      let endStock = item.currentStock;
      
      futureTrans.forEach(t => {
        if (t.type === 'IN') endStock -= t.quantity;
        else endStock += t.quantity;
      });

      const startStock = endStock - totalIn + totalOut;

      return {
        ...item,
        startStock,
        totalIn,
        totalOut,
        endStock
      };
    })
    .filter(row => row.startStock !== 0 || row.totalIn !== 0 || row.totalOut !== 0 || row.endStock !== 0);

    return calculated.sort((a, b) => {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        return a.name.localeCompare(b.name);
    });
  }, [items, transactions, selectedMonth]);

  // --- Pagination ---
  const pages = useMemo(() => {
    const chunks: ReportItem[][] = [];
    for (let i = 0; i < reportData.length; i += ROWS_PER_PAGE) {
      chunks.push(reportData.slice(i, i + ROWS_PER_PAGE));
    }
    if (chunks.length === 0) return [[]];
    return chunks;
  }, [reportData]);

  // --- PDF Download ---
  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    setIsGenerating(true);

    try {
      await document.fonts.ready;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageElements = contentRef.current.querySelectorAll('.print-page');

      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i] as HTMLElement;
        
        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc) => {
            const rows = clonedDoc.querySelectorAll('tr');
            rows.forEach(row => {
               row.style.pageBreakInside = 'avoid';
            });
          }
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

      pdf.save(`천안수질정화센터_월별수불부_${selectedMonth}.pdf`);
    } catch (e) {
      console.error(e);
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formattedMonth = `${selectedMonth.split('-')[0]}년 ${selectedMonth.split('-')[1]}월`;

  const commonCellStyle: React.CSSProperties = {
    padding: '4px 4px',
    height: '25px',
    verticalAlign: 'middle',
    borderRight: '1px solid #f1f5f9',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '9px',
    fontFamily: "'Noto Sans KR', sans-serif"
  };

  const headerCellStyle: React.CSSProperties = {
    ...commonCellStyle,
    height: '32px',
    backgroundColor: '#f1f5f9',
    borderRight: '1px solid #cbd5e1',
    borderTop: '2px solid #1e293b',
    borderBottom: '1px solid #1e293b',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0f172a',
    display: 'table-cell'
  };

  const cellStyles = {
    no: { ...commonCellStyle, textAlign: 'center', color: '#64748b' } as React.CSSProperties,
    category: { ...commonCellStyle, textAlign: 'center', fontWeight: '600', color: '#0f172a', backgroundColor: '#ffffff' } as React.CSSProperties,
    name: { ...commonCellStyle, textAlign: 'left', fontWeight: '500', color: '#1e293b' } as React.CSSProperties,
    standard: { ...commonCellStyle, textAlign: 'center', color: '#475569' } as React.CSSProperties, 
    model: { ...commonCellStyle, textAlign: 'center', color: '#475569' } as React.CSSProperties, 
    manufacturer: { ...commonCellStyle, textAlign: 'center', color: '#475569' } as React.CSSProperties, 
    stock: { ...commonCellStyle, textAlign: 'right', fontWeight: 'bold' } as React.CSSProperties,
    unit: { ...commonCellStyle, textAlign: 'center', color: '#334155' } as React.CSSProperties,
    location: { ...commonCellStyle, textAlign: 'center', color: '#475569', borderRight: 'none' } as React.CSSProperties
  };

  const getCategoryRowSpan = (pageItems: ReportItem[], currentIndex: number) => {
    const currentCategory = pageItems[currentIndex].category;
    if (currentIndex > 0 && pageItems[currentIndex - 1].category === currentCategory) {
      return 0;
    }
    let count = 1;
    for (let i = currentIndex + 1; i < pageItems.length; i++) {
      if (pageItems[i].category === currentCategory) count++;
      else break;
    }
    return count;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-auto p-4 custom-scrollbar">
      
      {/* Top Controls */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-lg z-[110] border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 px-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">기간:</span>
            <input 
                type="month" 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            />
        </div>
        <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>
        <button 
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg shadow-sm flex items-center gap-2 text-sm font-bold transition-colors disabled:opacity-50"
        >
          {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          PDF 저장
        </button>
        <button 
          onClick={onClose}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-2"
        >
          <X size={20} />
        </button>
      </div>

      {/* Pages Container */}
      <div ref={contentRef} className="flex flex-col gap-8 my-12 items-center">
        {pages.map((pageItems, pageIndex) => {
           const startIndex = pageIndex * ROWS_PER_PAGE;
           
           return (
            <div 
              key={pageIndex}
              className="print-page bg-white text-slate-900 w-[210mm] h-[297mm] shadow-2xl py-[15mm] px-[10mm] relative flex flex-col justify-between"
              style={{ pageBreakAfter: 'always' }}
            >
              <div className="flex-1">
                {/* Header */}
                <div className="mb-2 border-b-2 border-slate-800 pb-2">
                    <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">월별 재고 수불 현황</h1>
                    <div className="flex justify-between items-end mt-4">
                       <div className="text-left">
                           <p className="text-sm font-bold text-slate-700">기관명: 천안수질정화센터</p>
                           <p className="text-sm font-bold text-slate-700">대상기간: {formattedMonth}</p>
                       </div>
                       <div className="text-right">
                           <p className="text-[10px] text-slate-500">출력일자: {new Date().toLocaleDateString()}</p>
                           <p className="text-[10px] text-slate-500">Page {pageIndex + 1} / {pages.length}</p>
                       </div>
                    </div>
                </div>

                {/* Table for PDF Generation */}
                <table className="w-full text-[10px] border-collapse table-fixed">
                  <colgroup>
                    <col style={{ width: '5%' }} />  {/* No */}
                    <col style={{ width: '13%' }} /> {/* Category */}
                    <col style={{ width: '22%' }} /> {/* Name */}
                    <col style={{ width: '10%' }} /> {/* Standard (New) */}
                    <col style={{ width: '10%' }} /> {/* Model */}
                    <col style={{ width: '10%' }} /> {/* Manufacturer */}
                    <col style={{ width: '6%' }} />  {/* Unit */}
                    <col style={{ width: '6%' }} /> {/* Start */}
                    <col style={{ width: '6%' }} /> {/* In */}
                    <col style={{ width: '6%' }} /> {/* Out */}
                    <col style={{ width: '6%' }} /> {/* End */}
                  </colgroup>
                  <thead>
                    <tr style={{ height: '32px' }}>
                       <th style={headerCellStyle}>No</th>
                       <th style={headerCellStyle}>대분류</th>
                       <th style={headerCellStyle}>품목명</th>
                       <th style={headerCellStyle}>규격</th>
                       <th style={headerCellStyle}>품번(비고)</th>
                       <th style={headerCellStyle}>제조사</th>
                       <th style={headerCellStyle}>단위</th>
                       <th style={headerCellStyle}>기초</th>
                       <th style={{ ...headerCellStyle, color: '#1d4ed8', backgroundColor: '#eff6ff' }}>입고</th>
                       <th style={{ ...headerCellStyle, color: '#b91c1c', backgroundColor: '#fef2f2' }}>출고</th>
                       <th style={headerCellStyle}>기말</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.length === 0 ? (
                        <tr><td colSpan={11} className="text-center py-20 text-slate-400 text-base border border-slate-300">해당 월에 데이터가 없습니다.</td></tr>
                    ) : (
                        pageItems.map((item, i) => {
                            const rowSpan = getCategoryRowSpan(pageItems, i);
                            const rowStyle: React.CSSProperties = { 
                                borderBottom: '1px solid #e2e8f0' 
                            };

                            return (
                                <tr key={`${item.id}-${i}`} style={{ ...rowStyle, height: '25px', backgroundColor: '#ffffff' }}>
                                    <td style={cellStyles.no}>{startIndex + i + 1}</td>
                                    
                                    {rowSpan > 0 && (
                                      <td rowSpan={rowSpan} style={cellStyles.category}>
                                        {item.category}
                                      </td>
                                    )}

                                    <td style={cellStyles.name}>{item.name}</td>
                                    <td style={cellStyles.standard}>{item.standard}</td>
                                    <td style={cellStyles.model}>{item.model}</td>
                                    <td style={cellStyles.manufacturer}>{item.manufacturer}</td>
                                    <td style={cellStyles.unit}>{item.unit}</td>
                                    
                                    <td style={{...cellStyles.stock, backgroundColor: '#f8fafc'}}>{Number(item.startStock).toFixed(0)}</td>
                                    
                                    <td style={{...cellStyles.stock, color: '#2563eb'}}>
                                      {item.totalIn > 0 ? Number(item.totalIn).toFixed(0) : '-'}
                                    </td>
                                    <td style={{...cellStyles.stock, color: '#dc2626'}}>
                                      {item.totalOut > 0 ? Number(item.totalOut).toFixed(0) : '-'}
                                    </td>
                                    
                                    <td style={{...cellStyles.stock, backgroundColor: '#f8fafc', borderRight: 'none'}}>{Number(item.endStock).toFixed(0)}</td>
                                </tr>
                            );
                        })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="mt-0 pt-2 border-t border-slate-300 text-[9px] text-slate-500 flex justify-between items-center">
                 <span>System: Cheonan Water Inventory Manager v{APP_VERSION}</span>
                 <span className="font-bold">천안수질정화센터</span>
              </div>
            </div>
           );
        })}
      </div>
    </div>
  );
};

export default MonthlyReportModal;