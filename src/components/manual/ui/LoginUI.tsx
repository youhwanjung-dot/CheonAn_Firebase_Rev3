// import React from 'react'; // 최신 React/Vite에서는 불필요하여 주석 처리 (TS6133)
import { LogIn, User, KeyRound } from 'lucide-react';

const LoginUI = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm font-sans select-none overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="bg-slate-100 dark:bg-slate-900/50 p-6 border-b border-slate-200 dark:border-slate-700">
                 <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                         <LogIn size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">시스템 로그인</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">아이디와 비밀번호를 입력하세요.</p>
                    </div>
                 </div>
            </div>
            
            <div className="p-6 space-y-4">
                {/* Email Input */}
                <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                        <User size={12} />
                        아이디 (이메일)
                    </label>
                    <input 
                        type="email" 
                        placeholder="user@company.com"
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                        defaultValue="admin@chem-inventory.com"
                    />
                </div>

                {/* Password Input */}
                <div>
                     <label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                        <KeyRound size={12} />
                        비밀번호
                    </label>
                    <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                        defaultValue="••••••••••••"
                    />
                </div>
                
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="remember" className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked/>
                        <label htmlFor="remember" className="text-slate-600 dark:text-slate-300">아이디 저장</label>
                    </div>
                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">
                        비밀번호 찾기
                    </a>
                </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                 <button className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm">
                    <LogIn size={16}/>
                    로그인
                </button>
            </div>
        </div>
    );
}

export default LoginUI;
