// 주석 처리: 최신 Vite + React 환경에서는 JSX 트랜스폼을 자동으로 처리하므로 'React'를 명시적으로 import할 필요가 없습니다.
// (TypeScript 오류 'TS6133: 'React' is declared but its value is never read.' 방지)
// import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950 text-slate-400">
        <Loader2 size={48} className="animate-spin text-blue-600" />
        <p className="mt-4 text-lg font-semibold">데이터베이스 연결 중...</p>
        <p className="text-sm">잠시만 기다려 주세요.</p>
    </div>
);

export default LoadingFallback;
