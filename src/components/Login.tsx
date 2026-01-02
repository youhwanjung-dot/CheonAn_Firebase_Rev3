import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { ClipboardList, User as UserIcon, Lock, Check } from 'lucide-react';
import { APP_VERSION } from '../constants';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin, isDarkMode, toggleDarkMode }) => {
    const [id, setId] = useState<string>(users[0]?.id || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (users.length > 0 && !id) {
            setId(users[0].id);
        }
    }, [users, id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = users.find(u => u.id === id && u.password === password);
        if (user) {
            setError('');
            onLogin(user);
        } else {
            setError('비밀번호가 일치하지 않습니다.');
        }
    };

    return (
        <div className={`flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-950 p-4 transition-colors`}>
            <div className="w-full max-w-sm rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="bg-blue-600 p-8 text-center text-white">
                    <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <ClipboardList size={32} />
                    </div>
                    <h1 className="text-2xl font-bold">천안수질정화센터</h1>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <p className="opacity-80">재고 관리 시스템</p>
                      <span className="bg-white/20 text-xs font-bold px-2 py-0.5 rounded-full">Ver {APP_VERSION}</span>
                    </div>
                </div>

                {/* Form Body */}
                <div className="bg-white dark:bg-slate-800 p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                          <label className="text-sm font-bold text-slate-600 dark:text-slate-400" htmlFor="id">로그인 계정</label>
                          <div className="relative mt-1">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                id="id"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700 appearance-none"
                            >
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                                ))}
                            </select>
                          </div>
                      </div>
                      <div>
                          <label className="text-sm font-bold text-slate-600 dark:text-slate-400" htmlFor="password">비밀번호</label>
                           <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700"
                                    placeholder="비밀번호를 입력하세요"
                                />
                            </div>
                      </div>

                      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-1 flex">
                          <button
                            type="button"
                            onClick={() => isDarkMode && toggleDarkMode()}
                            className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 ${!isDarkMode ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                          >
                             일반 모드 {!isDarkMode && <Check size={16} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => !isDarkMode && toggleDarkMode()}
                            className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 ${isDarkMode ? 'bg-white dark:bg-slate-900 text-blue-500 shadow-sm' : 'text-slate-500'}`}
                          >
                            다크 모드 {isDarkMode && <Check size={16} />}
                          </button>
                      </div>

                      <button type="submit" className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-bold transition-colors">
                          시스템 접속
                      </button>
                  </form>
                </div>
                {/* Footer */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 text-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-700">
                    &copy; {new Date().getFullYear()} Cheonan Water Purification Center.
                </div>
            </div>
        </div>
    );
};

export default Login;