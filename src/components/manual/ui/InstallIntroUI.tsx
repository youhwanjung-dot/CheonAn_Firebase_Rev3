// import React from 'react'; // 최신 React/Vite에서는 불필요하여 주석 처리 (TS6133)
import { Monitor, Server, Database, ArrowRightLeft } from 'lucide-react';

const InstallIntroUI = () => {
    const boxStyle = "flex flex-col items-center justify-center p-4 border-2 rounded-lg text-center font-sans";
    const titleStyle = "font-bold text-sm mb-1 flex items-center gap-2";
    const descStyle = "text-xs text-slate-500 dark:text-slate-400";
    const arrowContainerStyle = "flex items-center justify-center p-2";

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm font-sans text-xs">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                {/* Frontend */}
                <div className={`${boxStyle} col-span-2 border-sky-500/50 bg-sky-50 dark:bg-sky-900/20`}>
                    <h3 className={`${titleStyle} text-sky-600 dark:text-sky-400`}><Monitor size={16}/>프론트엔드</h3>
                    <p className={descStyle}>React & Vite</p>
                </div>

                {/* Arrow */}
                <div className={`${arrowContainerStyle} col-span-1`}>
                    <div className="flex flex-col items-center">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">API 요청</p>
                        <ArrowRightLeft size={24} className="text-slate-400 my-1"/>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">데이터</p>
                    </div>
                </div>

                {/* Backend */}
                <div className={`${boxStyle} col-span-2 border-green-500/50 bg-green-50 dark:bg-green-900/20`}>
                     <h3 className={`${titleStyle} text-green-600 dark:text-green-400`}><Server size={16}/>백엔드</h3>
                     <p className={descStyle}>Node.js & Express</p>
                </div>

                 {/* Vertical Arrow to Data Storage */}
                 <div className="col-span-full flex justify-center items-center md:col-start-4 md:col-span-2 md:rotate-90 md:scale-y-150">
                     <div className="flex items-center my-2 md:my-0">
                         <ArrowRightLeft size={20} className="text-slate-400 mx-2"/>
                     </div>
                </div>

                {/* Data Storage */}
                 <div className={`${boxStyle} col-span-full md:col-start-4 md:col-span-2 border-orange-500/50 bg-orange-50 dark:bg-orange-900/20`}>
                    <h3 className={`${titleStyle} text-orange-600 dark:text-orange-400`}><Database size={16}/>데이터 저장소</h3>
                     <p className={descStyle}>File System (JSON)</p>
                </div>
            </div>
        </div>
    );
};

export default InstallIntroUI;
