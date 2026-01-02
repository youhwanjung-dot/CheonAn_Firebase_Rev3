import { useState } from 'react';
import { X, Download, Code, FileCode, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
// import { APP_VERSION } from '../constants'; // 사용되지 않는 변수로 주석 처리 (TS6133)

interface SourceDownloadModalProps {
  onClose: () => void;
}

const SourceDownloadModal = ({ onClose }: SourceDownloadModalProps) => {
  const [isPreparing, setIsPreparing] = useState(false);
  
  const handleDownload = async () => {
    setIsPreparing(true);
    try {
      console.log("Starting download process...");
      
      // Dynamic Import: Load the heavy exporter logic only when clicked
      const module = await import('../utils/sourceExporter');
      // The function now directly handles the download, so we just call it.
      await module.exportProjectSource();

    } catch (e) {
      console.error("Export failed", e);
      alert("다운로드 처리 중 알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsPreparing(false);
      // Since the download is initiated, we can close the modal as well.
      onClose(); 
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Code className="text-blue-600 dark:text-blue-400" />
            소스코드 및 설치파일 다운로드
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
           <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                 <FileCode size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                전체 소스코드 (ZIP)
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                현재 시스템의 모든 소스코드가 포함된 <strong>.zip 압축 파일</strong>을 다운로드합니다.
              </p>
           </div>

           <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4 text-sm border border-slate-100 dark:border-slate-700">
              <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                 <CheckCircle size={14} className="text-green-500" /> 사용 방법
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 marker:font-bold">
                 <li>다운로드한 ZIP 파일의 압축을 해제합니다.</li>
                 <li>터미널에서 <code>npm install</code> 또는 <code>yarn</code> 명령어로 의존성을 설치합니다.</li>
                 <li><code>npm run dev</code> 또는 <code>yarn dev</code> 명령어로 개발 서버를 시작합니다.</li>
              </ol>
           </div>
           
           <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded text-xs text-orange-800 dark:text-orange-300 flex gap-2 items-start border border-orange-100 dark:border-orange-900/50">
             <AlertTriangle size={14} className="mt-0.5 shrink-0" />
             <p><strong>참고:</strong> 이 기능은 현재 프로젝트의 프론트엔드 소스코드만 다운로드합니다. 서버 및 데이터베이스는 포함되지 않습니다.</p>
           </div>

           <button 
             onClick={handleDownload}
             disabled={isPreparing}
             className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
           >
             {isPreparing ? (
               <>
                 <Loader2 size={24} className="animate-spin" /> 다운로드 준비 중...
               </>
             ) : (
               <>
                 <Download size={24} /> 소스코드 다운로드
               </>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default SourceDownloadModal;
