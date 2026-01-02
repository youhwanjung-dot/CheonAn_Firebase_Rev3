import React, { useMemo, useRef, useState } from 'react';
import { InventoryItem, InventoryTransaction } from '../types';
import { X, Download, Loader2, AlertTriangle, Archive, TrendingUp, Calendar, Package } from 'lucide-react';
import { APP_VERSION } from '../constants';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportModalProps {
  items: InventoryItem[];
  transactions?: InventoryTransaction[];
  onClose: () => void;
  columnWidths: Record<string, number>;
}

const ReportModal: React.FC<ReportModalProps> = ({ items, transactions = [], onClose }) => {
  const today = useMemo(() => new Date(), []);
  const dateStr = today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const analysis = useMemo(() => {
    const shortage = items.filter(i => i.currentStock < i.safeStock && i.safeStock > 0)
        .sort((a, b) => (a.currentStock / a.safeStock) - (b.currentStock / b.safeStock));

    const overstock = items.filter(i => i.safeStock > 0 && i.currentStock > (i.safeStock * 3))
        .sort((a, b) => b.currentStock - a.currentStock);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    const activeItemIds = new Set(
        transactions
            .filter(t => t.type === 'OUT' && new Date(t.date) >= sixMonthsAgo)
            .map(t => t.itemId)
    );
    
    const deadStock = items.filter(i => 
        i.currentStock > 0 && !activeItemIds.has(i.id)
    ).sort((a, b) => b.currentStock - a.currentStock);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const usageMap = transactions
        .filter(t => t.type === 'OUT' && new Date(t.date) >= oneYearAgo)
        .reduce((acc, t) => {
            acc[t.itemId] = (acc[t.itemId] || 0) + t.quantity;
            return acc;
        }, {} as Record<string, number>);

    const turnoverRank = items.map(i => ({
        ...i,
        usageQty: usageMap[i.id] || 0
    })).sort((a, b) => b.usageQty - a.usageQty);

    const topTurnover = turnoverRank.filter(i => i.usageQty > 0).slice(0, 10);

    return { shortage, overstock, deadStock, topTurnover };
  }, [items, transactions, today]);

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
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      pdf.save(`재고_종합_분석_리포트_${today.toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Error generating PDF: ", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 animate-fade-in">
      <div className="bg-white w-full max-w-fit shadow-2xl rounded-xl overflow-hidden">
        
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg">종합 재고 분석 리포트</h2>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">A4 인쇄 최적화</span>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={handleDownloadPDF} 
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {isGenerating ? '생성 중...' : 'PDF 저장'}
                </button>
                <button 
                    onClick={onClose} 
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium transition-colors"
                >
                    <X size={16} /> 닫기
                </button>
            </div>
        </div>

        <div ref={contentRef} className="bg-gray-200 p-8">
          <div className="print-page w-[210mm] bg-white p-8 md:p-12 shadow-lg">
            <header className="border-b-2 border-slate-900 pb-4 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">재고 종합 분석 리포트</h1>
                    <p className="text-sm text-slate-500 font-medium">천안수질정화센터 자재관리 시스템</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-slate-700 flex items-center justify-end gap-2">
                        <Calendar size={14} /> 분석일자: {dateStr}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        전체 품목: {items.length}개 / v{APP_VERSION}
                    </p>
                </div>
            </header>

            <section className="grid grid-cols-4 gap-4 mb-8">
                <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-red-700 font-bold text-sm">
                        <AlertTriangle size={16} /> 적정재고 미달
                    </div>
                    <p className="text-3xl font-bold text-red-600">{analysis.shortage.length}<span className="text-base font-normal text-slate-500 ml-1">건</span></p>
                </div>
                <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-orange-700 font-bold text-sm">
                        <Archive size={16} /> 장기 미사용
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{analysis.deadStock.length}<span className="text-base font-normal text-slate-500 ml-1">건</span></p>
                </div>
                <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-yellow-700 font-bold text-sm">
                        <Package size={16} /> 과다 보유
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">{analysis.overstock.length}<span className="text-base font-normal text-slate-500 ml-1">건</span></p>
                </div>
                <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold text-sm">
                        <TrendingUp size={16} /> 회전율 우수
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{analysis.topTurnover.length}<span className="text-base font-normal text-slate-500 ml-1">건</span></p>
                </div>
            </section>

            <section className="mb-8 break-inside-avoid">
                <h3 className="text-lg font-bold text-slate-800 mb-3 border-l-4 border-red-500 pl-3 flex items-center justify-between">
                    1. 적정재고 미달 품목 (긴급 발주 요망)
                    <span className="text-xs font-normal text-slate-500">* 안전재고 대비 현재고 부족분 순 정렬</span>
                </h3>
                {analysis.shortage.length === 0 ? (
                    <div className="p-4 bg-slate-50 text-center text-slate-500 rounded border border-slate-200">
                        현재 부족한 재고가 없습니다.
                    </div>
                ) : (
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-slate-100 text-slate-700 border-t border-b border-slate-300">
                            <tr>
                                <th className="py-2 px-3">대분류</th>
                                <th className="py-2 px-3">품목명</th>
                                <th className="py-2 px-3">규격</th>
                                <th className="py-2 px-3 text-right">현재고</th>
                                <th className="py-2 px-3 text-right">적정재고</th>
                                <th className="py-2 px-3 text-right font-bold text-red-600">부족분</th>
                                <th className="py-2 px-3 text-center">보관장소</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {analysis.shortage.map(item => (
                                <tr key={item.id} className="break-inside-avoid">
                                    <td className="py-2 px-3 text-slate-600">{item.category}</td>
                                    <td className="py-2 px-3 font-bold">{item.name}</td>
                                    <td className="py-2 px-3 text-slate-500 text-xs">{item.standard}</td>
                                    <td className="py-2 px-3 text-right font-mono">{item.currentStock}</td>
                                    <td className="py-2 px-3 text-right font-mono">{item.safeStock}</td>
                                    <td className="py-2 px-3 text-right font-mono font-bold text-red-600">-{item.safeStock - item.currentStock}</td>
                                    <td className="py-2 px-3 text-center text-xs">{item.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <section className="mb-8 break-inside-avoid">
                <h3 className="text-lg font-bold text-slate-800 mb-3 border-l-4 border-orange-500 pl-3 flex items-center justify-between">
                    2. 장기 미사용 품목 (Dead Stock)
                    <span className="text-xs font-normal text-slate-500">* 최근 6개월간 출고 이력 없음</span>
                </h3>
                {analysis.deadStock.length === 0 ? (
                    <div className="p-4 bg-slate-50 text-center text-slate-500 rounded border border-slate-200">
                        장기 미사용 품목이 없습니다.
                    </div>
                ) : (
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-slate-100 text-slate-700 border-t border-b border-slate-300">
                            <tr>
                                <th className="py-2 px-3">대분류</th>
                                <th className="py-2 px-3">품목명</th>
                                <th className="py-2 px-3">규격</th>
                                <th className="py-2 px-3 text-right">현재고</th>
                                <th className="py-2 px-3 text-right">환산가치(추정)</th>
                                <th className="py-2 px-3 text-center">비고</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {analysis.deadStock.slice(0, 10).map(item => (
                                <tr key={item.id} className="break-inside-avoid">
                                    <td className="py-2 px-3 text-slate-600">{item.category}</td>
                                    <td className="py-2 px-3 font-bold">{item.name}</td>
                                    <td className="py-2 px-3 text-slate-500 text-xs">{item.standard}</td>
                                    <td className="py-2 px-3 text-right font-mono">{item.currentStock}</td>
                                    <td className="py-2 px-3 text-right text-slate-400 text-xs">-</td>
                                    <td className="py-2 px-3 text-center text-xs text-slate-500">활용 계획 필요</td>
                                </tr>
                            ))}
                        </tbody>
                        {analysis.deadStock.length > 10 && (
                            <tfoot>
                                <tr>
                                    <td colSpan={6} className="py-2 text-center text-xs text-slate-500 italic">
                                        외 {analysis.deadStock.length - 10}개 품목 생략됨 (전체 목록은 엑셀 다운로드 활용)
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                )}
            </section>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 break-inside-avoid page-break-after-avoid">
                <section className="break-inside-avoid">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-l-4 border-yellow-500 pl-3">
                        3. 과다 보유 품목 (Top 5)
                    </h3>
                    <table className="w-full text-sm text-left border-collapse">
                         <thead className="bg-slate-100 text-slate-700 border-t border-b border-slate-300">
                            <tr>
                                <th className="py-2 px-2">품목명</th>
                                <th className="py-2 px-2 text-right">현재고</th>
                                <th className="py-2 px-2 text-right">적정재고</th>
                                <th className="py-2 px-2 text-right">초과율</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {analysis.overstock.slice(0, 5).map(item => (
                                <tr key={item.id}>
                                    <td className="py-2 px-2 font-medium truncate max-w-[120px]">{item.name}</td>
                                    <td className="py-2 px-2 text-right font-mono">{item.currentStock}</td>
                                    <td className="py-2 px-2 text-right font-mono text-slate-500">{item.safeStock}</td>
                                    <td className="py-2 px-2 text-right font-bold text-yellow-600">
                                        {item.safeStock > 0 ? ((item.currentStock / item.safeStock) * 100).toFixed(0) : '∞'}%
                                    </td>
                                </tr>
                            ))}
                            {analysis.overstock.length === 0 && (
                                <tr><td colSpan={4} className="py-4 text-center text-slate-400">과다 보유 품목 없음</td></tr>
                            )}
                        </tbody>
                    </table>
                </section>

                <section className="break-inside-avoid">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-l-4 border-blue-500 pl-3">
                        4. 재고 회전율 상위 (Top 5)
                    </h3>
                     <table className="w-full text-sm text-left border-collapse">
                         <thead className="bg-slate-100 text-slate-700 border-t border-b border-slate-300">
                            <tr>
                                <th className="py-2 px-2">품목명</th>
                                <th className="py-2 px-2 text-right">연간 출고량</th>
                                <th className="py-2 px-2 text-right">현재고</th>
                                <th className="py-2 px-2 text-center">비고</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {analysis.topTurnover.slice(0, 5).map(item => (
                                <tr key={item.id}>
                                    <td className="py-2 px-2 font-medium truncate max-w-[120px]">{item.name}</td>
                                    <td className="py-2 px-2 text-right font-bold text-blue-600">{item.usageQty}</td>
                                    <td className="py-2 px-2 text-right font-mono">{item.currentStock}</td>
                                    <td className="py-2 px-2 text-center text-xs text-slate-500">
                                        {item.currentStock < item.usageQty / 12 ? '재고주의' : '양호'}
                                    </td>
                                </tr>
                            ))}
                             {analysis.topTurnover.length === 0 && (
                                <tr><td colSpan={4} className="py-4 text-center text-slate-400">출고 데이터 없음</td></tr>
                            )}
                        </tbody>
                    </table>
                </section>
             </div>

             <footer className="mt-8 pt-4 border-t border-slate-300 text-center text-xs text-slate-500">
                천안수질정화센터 자재관리 시스템 v{APP_VERSION} | 출력일시: {new Date().toLocaleString()}
             </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
