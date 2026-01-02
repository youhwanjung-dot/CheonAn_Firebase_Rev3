// import React from 'react'; // 최신 React/Vite에서는 불필요하여 주석 처리 (TS6133)
import { Package } from 'lucide-react';

const InstallDependenciesUI = () => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 font-sans">
      <div className="flex items-center gap-2 mb-3">
        <Package size={16} className="text-slate-500" />
        <h5 className="font-bold text-sm text-slate-700 dark:text-slate-200">`package.json` 주요 의존성</h5>
      </div>
      <div className="text-[10px] bg-slate-100 dark:bg-slate-900/50 p-3 rounded-md text-slate-600 dark:text-slate-400">
        <p><span className="text-pink-500">&quot;@faker-js/faker&quot;</span>: <span className="text-amber-500">&quot;^8.4.1&quot;</span>,</p>
        <p><span className="text-pink-500">&quot;@tanstack/react-table&quot;</span>: <span className="text-amber-500">&quot;^8.10.7&quot;</span>,</p>
        <p><span className="text-pink-500">&quot;axios&quot;</span>: <span className="text-amber-500">&quot;^1.6.0&quot;</span>,</p>
        <p><span className="text-pink-500">&quot;chart.js&quot;</span>: <span className="text-amber-500">&quot;^4.4.0&quot;</span>,</p>
        <p><span className="text-pink-500">&quot;date-fns&quot;</span>: <span className="text-amber-500">&quot;^2.30.0&quot;</span>,</p>
        <p><span className="text-pink-500">&quot;firebase&quot;</span>: <span className="text-amber-500">&quot;^10.6.0&quot;</span>,</p>
        <p><span className="text-pink-500">&quot;html2canvas&quot;</span>: <span className="text-amber-500">&quot;^1.4.1&quot;</span>,</p>
        <p><span className="text-pink-500">&quot;jspdf&quot;</span>: <span className="text-amber-500">&quot;^2.5.1&quot;</span>,</p>
        <p><span className="text-pink-500">&quot;lucide-react&quot;</span>: <span className="text-amber-500">&quot;^0.292.0&quot;</span>,</p>
        <p><span className="text-pink-500">&quot;react&quot;</span>: <span className="text-amber-500">&quot;^18.2.0&quot;</span>,</p>
        <p><span className="text-pink-500">... (기타 등등)</span></p>
      </div>
      <div className="mt-4 p-3 bg-black rounded-lg font-mono text-[10px] text-slate-300 relative">
        <div className="absolute top-2 right-2 text-slate-500 text-[10px]">bash</div>
        <p className="text-green-400">$ <span className="text-white">npm install</span></p>
        <p className="text-slate-400">added 1153 packages, and audited 1154 packages in 2m</p>
        <p className="text-slate-400">found <span className="text-amber-400">0</span> vulnerabilities</p>
      </div>
    </div>
  );
}

export default InstallDependenciesUI;
