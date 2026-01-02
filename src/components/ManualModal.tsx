import React, { useState, useRef } from 'react';
import { 
    X, Download
    // BookOpen, Monitor, User, Lock, 
    // LayoutDashboard, PieChart, Warehouse, ArrowRightLeft, FileDown, 
    // FilePlus2, UploadCloud, CheckCheck, FileWarning, Cog, Users, 
    // UserPlus, Shield, Info, HardDrive, Wrench, PlayCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { APP_VERSION } from '../constants';

// Import User Manual Components
import LoginManual from './manual/U.01_Login';
import OverviewManual from './manual/U.02_Overview';
import DashboardManual from './manual/U.03_Dashboard';
import StatisticsManual from './manual/U.04_Statistics';
import AnalysisManual from './manual/U.05_Analysis';
import InventoryManual from './manual/U.06_Inventory';
import HistoryManual from './manual/U.07_History';
import BulkImportManual from './manual/U.08_BulkImport';
import HistoryImportManual from './manual/U.09_HistoryImport';
import SettingsManual from './manual/U.10_Settings';
import MasterDataManual from './manual/U.11_MasterData';
import UserManagementManual from './manual/U.12_UserManagement';


// Import Installation Manual Components
import InstallManual from './manual/I.01_Intro';
import EnvironmentManual from './manual/I.02_Environment';
import InstallationManual from './manual/I.03_Installation';
import RunningManual from './manual/I.04_Running';


interface ManualModalProps {
  onClose: () => void;
}

type ManualType = 'USER' | 'INSTALL';

const ManualModal: React.FC<ManualModalProps> = ({ onClose }) => {
  const [manualType, setManualType] = useState<ManualType>('USER');
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    const content = contentRef.current;
    setIsGenerating(true);
    
    content.classList.add('pdf-generating');

    try {
        await document.fonts.ready;
        const canvas = await html2canvas(content, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            onclone: (doc) => {
                const clonedContent = doc.querySelector('.manual-page-container');
                if (clonedContent) {
                    clonedContent.querySelectorAll('section, .step-box, .mockup-container').forEach(el => {
                        (el as HTMLElement).style.pageBreakInside = 'avoid';
                    });
                }
            }
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / pdfWidth;
        const chunkHeight = pdfHeight * ratio;

        let y = 0;
        let page = 1;
        while (y < canvasHeight) {
            if (page > 1) {
                pdf.addPage();
            }
            const chunkCanvas = document.createElement('canvas');
            const chunkContext = chunkCanvas.getContext('2d');
            
            chunkCanvas.width = canvasWidth;
            chunkCanvas.height = chunkHeight;
            
            chunkContext?.drawImage(canvas, 0, y, canvasWidth, chunkHeight, 0, 0, canvasWidth, chunkHeight);
            
            const chunkImgData = chunkCanvas.toDataURL('image/png');
            pdf.addImage(chunkImgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            
            y += chunkHeight;
            page++;
        }
        
        const fileName = manualType === 'USER' ? `재고관리_사용자매뉴얼_v${APP_VERSION}.pdf` : `재고관리_설치매뉴얼_v${APP_VERSION}.pdf`;
        pdf.save(fileName);

    } catch (e) {
        console.error(e);
        alert('PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
        setIsGenerating(false);
        content.classList.remove('pdf-generating');
    }
  };

  const pageStyle = "manual-page bg-white w-[210mm] min-h-[297mm] mx-auto shadow-lg p-[15mm] text-slate-800 mb-8 print:shadow-none print:mb-0 print:w-full";
  const headerStyle = "border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-end";
  const h1Style = "text-2xl font-bold text-slate-900";
  const h2Style = "text-lg font-bold text-blue-700 mt-6 mb-3 flex items-center gap-2 border-b border-blue-100 pb-1";
  const pStyle = "text-sm leading-relaxed text-slate-700 mb-3";
  const codeBlockStyle = "bg-slate-800 text-slate-200 p-3 rounded-lg text-xs font-mono mb-4 overflow-x-auto whitespace-pre-wrap";
  const mockupContainerStyle = "border border-slate-300 rounded-xl bg-slate-100 p-4 mb-4 shadow-sm select-none";
  const mockupWindowStyle = "bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden font-sans";

  const commonProps = {
    pageStyle,
    headerStyle,
    h1Style,
    h2Style,
    pStyle,
    codeBlockStyle,
    mockupContainerStyle,
    mockupWindowStyle
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 custom-scrollbar print:p-0 print:bg-white print:static">
      
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-lg z-[110] border border-slate-200 dark:border-slate-700 print:hidden">
         <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button 
                onClick={() => setManualType('USER')}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${manualType === 'USER' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
                사용자 매뉴얼
            </button>
            <button 
                onClick={() => setManualType('INSTALL')}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${manualType === 'INSTALL' ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-300 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
                설치 매뉴얼
            </button>
         </div>
         <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>
         <button onClick={handleDownloadPDF} disabled={isGenerating} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/30" title="PDF 다운로드">
            {isGenerating ? <span className="animate-spin">⏳</span> : <Download size={20} />}
         </button>
         <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/30" title="닫기">
            <X size={20} />
         </button>
      </div>

      <div ref={contentRef} className="mt-16 print:mt-0 manual-page-container">
        
        {manualType === 'USER' && (
            <>
                <LoginManual {...commonProps} />
                <OverviewManual {...commonProps} />
                <DashboardManual {...commonProps} />
                <StatisticsManual {...commonProps} />
                <AnalysisManual {...commonProps} />
                <InventoryManual {...commonProps} />
                <HistoryManual {...commonProps} />
                <BulkImportManual {...commonProps} />
                <HistoryImportManual {...commonProps} />
                <SettingsManual {...commonProps} />
                <MasterDataManual {...commonProps} />
                <UserManagementManual {...commonProps} />
            </>
        )}

        {manualType === 'INSTALL' && (
            <>
                <InstallManual {...commonProps} />
                <EnvironmentManual {...commonProps} />
                <InstallationManual {...commonProps} />
                <RunningManual {...commonProps} />
            </>
        )}

      </div>
    </div>
  );
};

export default ManualModal;