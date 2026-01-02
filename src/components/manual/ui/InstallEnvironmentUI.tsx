// import React from 'react'; // 최신 React/Vite에서는 불필요하여 주석 처리 (TS6133)
import { CheckCircle } from 'lucide-react';

const InstallEnvironmentUI = () => {
  const tools = [
    { name: 'Node.js', version: 'v20.10.0', description: 'JavaScript 런타임', recommended: true },
    { name: 'npm', version: 'v10.2.3', description: '패키지 매니저', recommended: true },
    { name: 'Git', version: 'v2.39.2', description: '버전 관리 시스템', recommended: false },
    { name: 'Firebase CLI', version: 'v13.0.2', description: 'Firebase 명령줄 도구', recommended: false },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 font-sans">
      <ul className="space-y-3">
        {tools.map((tool, index) => (
          <li key={index} className="flex items-start p-2 rounded-md transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <CheckCircle size={14} className={`mt-0.5 flex-shrink-0 ${tool.recommended ? 'text-green-500' : 'text-slate-400'}`} />
            <div className="ml-3">
              <p className="font-bold text-xs text-slate-800 dark:text-slate-100">{tool.name} <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">({tool.version})</span></p>
              <p className="text-[10px] text-slate-600 dark:text-slate-300">{tool.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstallEnvironmentUI;
