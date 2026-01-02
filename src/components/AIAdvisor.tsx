import React, { useState, useMemo, useRef } from 'react';
import { Sparkles, FileDown, AlertTriangle, Archive, /*TrendingUp,*/ Package, Info, Loader2, BarChart2 } from 'lucide-react';
import { InventoryItem, InventoryTransaction } from '../types';
// import { analyzeInventory } from '../services/geminiService'; // AI 기능 비활성화
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface AIAdvisorProps {
  items: InventoryItem[];
  transactions?: InventoryTransaction[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ items, transactions = [] }) => {
  const [aiComment, setAiComment] = useState<string>("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const reportContainerRef = useRef<HTMLDivElement>(null);

  const analysis = useMemo(() => {
    const shortage = items.filter(i => i.currentStock < i.safeStock && i.safeStock > 0).sort((a, b) => (a.currentStock / a.safeStock) - (b.currentStock / b.safeStock));
    const overstock = items.filter(i => i.safeStock > 0 && i.currentStock > (i.safeStock * 2)).sort((a, b) => b.currentStock - a.currentStock);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const activeItemIds = new Set(transactions.filter(t => t.type === 'OUT' && new Date(t.date) >= ninetyDaysAgo).map(t => t.itemId));
    const deadStock = items.filter(i => i.currentStock > 0 && !activeItemIds.has(i.id)).sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
    const usageMap = transactions.filter(t => t.type === 'OUT').reduce((acc, t) => { acc[t.itemId] = (acc[t.itemId] || 0) + t.quantity; return acc; }, {} as Record<string, number>);
    const turnoverRank = items.map(i => ({ ...i, totalUsage: usageMap[i.id] || 0 })).sort((a, b) => b.totalUsage - a.totalUsage);
    const topTurnover = turnoverRank.filter(i => i.totalUsage > 0);
    return { shortage, overstock, deadStock, topTurnover };
  }, [items, transactions]);

  const handleGenerateInsight = async () => {
    setAiComment("**AI 의견 기능은 현재 비활성화되어 있습니다.** API 할당량 문제로 인해 일시적으로 중단되었습니다. 기존 데이터 분석 기능은 정상적으로 사용 가능합니다.");
  };

  const handleDownloadPDF = async () => {
    if (!reportContainerRef.current) return;
    setIsGeneratingPdf(true);
    try {
        await document.fonts.ready;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pages = reportContainerRef.current.querySelectorAll('.report-page');
        for (let i = 0; i < pages.length; i++) {
            if (i > 0) pdf.addPage();
            const pageEl = pages[i] as HTMLElement;
            const canvas = await html2canvas(pageEl, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        }
        const dateStr = new Date().toISOString().slice(0, 10);
        pdf.save(`천안수질정화센터_AI분석리포트_${dateStr}.pdf`);
    } catch (e) {
        console.error(e);
        alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  const todayStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  const TableHeader = ({ cols }: { cols: string[] }) => (
    <thead className="bg-slate-100 text-slate-700 font-bold text-xs border-t border-b border-slate-300">
        <tr>
            <th className="p-2 w-[40px] text-center">No</th>
            <th className="p-2 w-[80px] text-center">대분류</th>
            <th className="p-2 text-left">품목명</th>
            <th className="p-2 w-[100px] text-center">규격</th>
            {cols.map((col, idx) => <th key={idx} className="p-2 text-right w-[80px]">{col}</th>)}
        </tr>
    </thead>
  );

  return (
    <div className="bg-white dark:bg-slate-900 h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 shrink-0 z-10">
         <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><BarChart2 className="text-blue-600" /> 재고 분석 리포트</h2>
         <div className="flex gap-2">
            <button onClick={handleGenerateInsight} disabled={true} className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-500 rounded-lg text-sm font-bold transition-colors disabled:opacity-70 cursor-not-allowed">
                <Sparkles size={16} />의견 생성 (비활성)
            </button>
            <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-2"></div>
            <button onClick={handleDownloadPDF} disabled={isGeneratingPdf} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50">
                {isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />} {isGeneratingPdf ? 'PDF 생성 중...' : '리포트 저장'}
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-200/50 dark:bg-slate-950/50 flex justify-center">
         <div ref={reportContainerRef} className="flex flex-col gap-8">

            {/* ================= PAGE 1: Data Analysis Part 1 ================= */}
            <div className="report-page w-[210mm] min-h-[297mm] bg-white shadow-xl p-[15mm] text-slate-900 flex flex-col">
                <header className="border-b-2 border-slate-800 pb-4 mb-4 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">천안수질정화센터 Inventory Analytics</h1>
                        <p className="text-sm text-slate-500 font-bold mt-1">자재관리 데이터 분석 리포트</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-600">분석일자: {todayStr}</p>
                        <p className="text-xs text-slate-400">Generated by System</p>
                    </div>
                </header>

                <div className="grid grid-cols-4 gap-3 mb-5">
                    <div className="bg-white border-l-4 border-slate-500 shadow-sm p-3 rounded border border-slate-100"><p className="text-[10px] font-bold text-slate-500 mb-1 flex items-center gap-1"><Package size={10}/> 전체 품목</p><p className="text-xl font-bold text-slate-800">{items.length}<span className="text-xs font-normal text-slate-400 ml-1">개</span></p></div>
                    <div className="bg-white border-l-4 border-red-500 shadow-sm p-3 rounded border border-slate-100"><p className="text-[10px] font-bold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle size={10}/> 긴급 발주</p><p className="text-xl font-bold text-red-600">{analysis.shortage.length}<span className="text-xs font-normal text-slate-400 ml-1">건</span></p></div>
                    <div className="bg-white border-l-4 border-orange-400 shadow-sm p-3 rounded border border-slate-100"><p className="text-[10px] font-bold text-orange-600 mb-1 flex items-center gap-1"><Archive size={10}/> 과다 보유</p><p className="text-xl font-bold text-orange-600">{analysis.overstock.length}<span className="text-xs font-normal text-slate-400 ml-1">건</span></p></div>
                    <div className="bg-white border-l-4 border-blue-400 shadow-sm p-3 rounded border border-slate-100"><p className="text-[10px] font-bold text-blue-600 mb-1 flex items-center gap-1"><Info size={10}/> 장기 미사용</p><p className="text-xl font-bold text-blue-600">{analysis.deadStock.length}<span className="text-xs font-normal text-slate-400 ml-1">건</span></p></div>
                </div>

                <div className="flex flex-col gap-6 flex-1 content-start">
                    <section>
                        <h3 className="font-bold text-base text-slate-800 mb-2 flex items-center gap-2 border-b border-slate-200 pb-1"><span className="text-red-600">1.</span> 긴급 발주 요망 (Critical Shortage - Top 5)</h3>
                        <table className="w-full text-[10px] border-collapse"> 
                            <TableHeader cols={['현재고', '적정재고', '부족분']} />
                            <tbody>{analysis.shortage.slice(0, 5).map((item, idx) => <tr key={idx} className="border-b border-slate-100 h-[24px]"><td className="p-1.5 text-center text-slate-500">{idx + 1}</td><td className="p-1.5 text-center text-slate-600">{item.category}</td><td className="p-1.5 font-medium">{item.name}</td><td className="p-1.5 text-center text-slate-500">{item.standard}</td><td className="p-1.5 text-right font-mono">{item.currentStock}</td><td className="p-1.5 text-right font-mono">{item.safeStock}</td><td className="p-1.5 text-right font-bold text-red-600 bg-red-50">-{item.safeStock - item.currentStock}</td></tr>)}{analysis.shortage.length === 0 && <tr><td colSpan={7} className="text-center py-3 text-slate-400 italic">해당 항목 없음</td></tr>}</tbody>
                        </table>
                    </section>
                    <section>
                         <h3 className="font-bold text-base text-slate-800 mb-2 flex items-center gap-2 border-b border-slate-200 pb-1"><span className="text-orange-500">2.</span> 과다 보유 품목 (Overstock - Top 5)</h3>
                         <table className="w-full text-[10px] border-collapse">
                            <TableHeader cols={['현재고', '적정재고', '초과분']} />
                            <tbody>{analysis.overstock.slice(0, 5).map((item, idx) => <tr key={idx} className="border-b border-slate-100 h-[24px]"><td className="p-1.5 text-center text-slate-500">{idx + 1}</td><td className="p-1.5 text-center text-slate-600">{item.category}</td><td className="p-1.5 font-medium">{item.name}</td><td className="p-1.5 text-center text-slate-500">{item.standard}</td><td className="p-1.5 text-right font-mono">{item.currentStock}</td><td className="p-1.5 text-right font-mono">{item.safeStock}</td><td className="p-1.5 text-right font-bold text-orange-600">+{item.currentStock - item.safeStock}</td></tr>)}{analysis.overstock.length === 0 && <tr><td colSpan={7} className="text-center py-3 text-slate-400 italic">해당 항목 없음</td></tr>}</tbody>
                        </table>
                    </section>
                     <section>
                        <h3 className="font-bold text-base text-slate-800 mb-2 flex items-center gap-2 border-b border-slate-200 pb-1"><span className="text-blue-500">3.</span> 장기 미사용 (Dead Stock - Top 5)</h3>
                        <table className="w-full text-[10px] border-collapse">
                            <TableHeader cols={['현재고', '최종수정', '상태']} />
                           <tbody>{analysis.deadStock.slice(0, 5).map((item, idx) => <tr key={idx} className="border-b border-slate-100 h-[24px]"><td className="p-1.5 text-center text-slate-500">{idx + 1}</td><td className="p-1.5 text-center text-slate-600">{item.category}</td><td className="p-1.5 font-medium">{item.name}</td><td className="p-1.5 text-center text-slate-500">{item.standard}</td><td className="p-1.5 text-right font-mono">{item.currentStock}</td><td className="p-1.5 text-right text-slate-500 text-[9px]">{item.lastUpdated}</td><td className="p-1.5 text-right text-slate-400 text-[9px]">90일+ 미사용</td></tr>)}{analysis.deadStock.length === 0 && <tr><td colSpan={7} className="text-center py-3 text-slate-400 italic">해당 항목 없음</td></tr>}</tbody>
                        </table>
                    </section>
                </div>

                <footer className="mt-auto pt-4 border-t border-slate-300 flex justify-between text-[10px] text-slate-500"><span>천안수질정화센터 재고관리 시스템</span><span>Page 1 / 2</span></footer>
            </div>

            {/* ================= PAGE 2: Data Analysis Part 2 & AI Insight ================= */}
            <div className="report-page w-[210mm] min-h-[297mm] bg-white shadow-xl p-[15mm] text-slate-900 flex flex-col justify-between">
                <div className="flex flex-col gap-8 flex-1">
                    <header className="border-b-2 border-slate-800 pb-2 mb-0 flex justify-between items-end">
                         <div><h1 className="text-xl font-bold text-slate-900 tracking-tight">재고 종합 분석 리포트 (계속)</h1></div>
                        <div className="text-right"><p className="text-xs text-slate-400">분석일자: {todayStr}</p></div>
                    </header>
                    <section>
                        <h3 className="font-bold text-base text-slate-800 mb-2 flex items-center gap-2 border-b border-slate-200 pb-1"><span className="text-green-600">4.</span> 재고 회전율 (Turnover Rate - Top 5)</h3>
                        <table className="w-full text-[10px] border-collapse">
                            <TableHeader cols={['현재고', '출고량', '회전상태']} />
                            <tbody>{analysis.topTurnover.slice(0, 5).map((item, idx) => <tr key={idx} className="border-b border-slate-100 h-[24px]"><td className="p-1.5 text-center text-slate-500">{idx + 1}</td><td className="p-1.5 text-center text-slate-600">{item.category}</td><td className="p-1.5 font-medium">{item.name}</td><td className="p-1.5 text-center text-slate-500">{item.standard}</td><td className="p-1.5 text-right font-mono">{item.currentStock}</td><td className="p-1.5 text-right font-bold text-green-700">{item.totalUsage}</td><td className="p-1.5 text-right text-blue-600 font-bold text-[9px]">High</td></tr>)}{analysis.topTurnover.length === 0 && <tr><td colSpan={7} className="text-center py-3 text-slate-400 italic">데이터 없음</td></tr>}</tbody>
                        </table>
                    </section>
                    <section>
                        <div className="flex justify-between items-center mb-6 mt-8"><h3 className="font-bold text-2xl text-slate-800 flex items-center gap-2"><Sparkles size={24} className="text-purple-600" /> 전문가 종합 의견 (AI Insight)</h3></div>
                        <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl text-base leading-relaxed text-slate-800 min-h-[400px] shadow-inner">
                            {aiComment ? (
                                <div className="prose prose-slate max-w-none"><ReactMarkdown>{aiComment}</ReactMarkdown></div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20 italic">
                                    <Sparkles size={48} className="mb-4 text-slate-300" />
                                    <p className="text-base">상단 &apos;의견 생성 (비활성)&apos; 버튼을 통해 AI 의견을 받을 수 있습니다.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
                <footer className="mt-8 pt-4 border-t border-slate-300 flex justify-between text-[10px] text-slate-500"><span>천안수질정화센터 재고관리 시스템</span><span>Page 2 / 2</span></footer>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AIAdvisor;