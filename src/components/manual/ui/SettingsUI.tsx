import { useState } from 'react';
import { User, Bell, Database, Trash2, Download } from 'lucide-react';

const SettingsUI = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">사용자 이름</label>
                            <input type="text" defaultValue="김철수" className="w-full sm:w-1/2 p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                        </div>
                         <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">현재 비밀번호</label>
                            <input type="password" placeholder="********" className="w-full sm:w-1/2 p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">새 비밀번호</label>
                            <input type="password" placeholder="새 비밀번호 입력" className="w-full sm:w-1/2 p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                        </div>
                        <button className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700">프로필 저장</button>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                            <span className="font-medium">재고 부족 알림 (안전재고 이하)</span>
                            <label className="switch"><input type="checkbox" defaultChecked /><span className="slider round"></span></label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                            <span className="font-medium">일일 재고 보고서 수신</span>
                             <label className="switch"><input type="checkbox" defaultChecked /><span className="slider round"></span></label>
                        </div>
                         <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                            <span className="font-medium">신규 품목 등록 알림</span>
                             <label className="switch"><input type="checkbox" /><span className="slider round"></span></label>
                        </div>
                    </div>
                );
            case 'data':
                return (
                     <div className="space-y-4">
                        <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <h5 className="font-bold mb-1">데이터 백업</h5>
                            <p className="text-slate-600 dark:text-slate-400 mb-3">모든 재고 및 수불 데이터를 XLSX 파일로 백업합니다.</p>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700">
                                <Download size={16}/>
                                백업 파일 다운로드
                            </button>
                        </div>
                         <div className="p-3 border border-red-500/30 dark:border-red-500/50 rounded-lg">
                            <h5 className="font-bold text-red-600 dark:text-red-400 mb-1">시스템 초기화</h5>
                            <p className="text-slate-600 dark:text-slate-400 mb-3">모든 데이터를 영구적으로 삭제하고 시스템을 초기 상태로 되돌립니다. 이 작업은 되돌릴 수 없습니다.</p>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700">
                                <Trash2 size={16}/>
                                데이터 전체 삭제
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm font-sans text-xs">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button onClick={() => setActiveTab('profile')} className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}><User size={14}/> 프로필</button>
                <button onClick={() => setActiveTab('notifications')} className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}><Bell size={14}/> 알림</button>
                <button onClick={() => setActiveTab('data')} className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}><Database size={14}/> 데이터 관리</button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                {renderContent()}
            </div>

            {/* Simple CSS for tabs in the component for encapsulation */}
            <style>{`
                .tab-button {
                    padding: 0.75rem 1rem;
                    font-weight: 600;
                    border: none;
                    background: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #475569; /* slate-600 */
                }
                .dark .tab-button { color: #94a3b8; /* slate-400 */ }
                .tab-button.active {
                    color: #2563eb; /* blue-600 */
                    border-bottom: 2px solid #2563eb;
                }
                 .dark .tab-button.active { color: #3b82f6; /* blue-500 */ border-color: #3b82f6; }

                /* Simple toggle switch */
                .switch { position: relative; display: inline-block; width: 34px; height: 20px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
                .slider.round { border-radius: 20px; }
                .slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
                input:checked + .slider { background-color: #2563eb; }
                input:checked + .slider:before { transform: translateX(14px); }
            `}</style>
        </div>
    );
};

export default SettingsUI;
