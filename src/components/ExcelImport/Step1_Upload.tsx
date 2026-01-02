
import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface Step1UploadProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

const Step1_Upload: React.FC<Step1UploadProps> = ({ onFileUpload, onCancel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 overflow-auto p-6">
      <div
        className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept=".xlsx, .xls"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileUpload}
        />
        <div className="bg-white dark:bg-slate-700 p-4 rounded-full shadow-sm mb-4">
          <Upload size={32} className="text-blue-500 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
          엑셀 파일 업로드
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm text-center">
          <strong>천안수질정화센터(전기자재)</strong> 레거시 양식 또는
          <br />
          시스템에서 내려받은 표준 양식을 모두 지원합니다.
        </p>
      </div>
      {/* This is a subtle way to acknowledge the onCancel prop without a visible button */}
      <button onClick={onCancel} className="hidden" aria-hidden="true"></button>
    </div>
  );
};

export default Step1_Upload;
