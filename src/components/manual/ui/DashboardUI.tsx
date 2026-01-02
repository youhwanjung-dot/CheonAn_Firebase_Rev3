import React from 'react';
import { BarChart, Bell, CheckCircle, Package, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ icon, title, value, colorClass }: { icon: React.ReactNode, title: string, value: string, colorClass: string }) => (
    <div className={`bg-white dark:bg-slate-800 p-3 rounded-xl shadow-md flex items-center justify-between border-l-4 ${colorClass}`}>
        <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>
        {icon}
    </div>
);

const DashboardUI = () => {
    const inventoryStatus = [
        { name: '폴리염화알루미늄', current: 80, max: 100, status: 'safe' },
        { name: '차아염소산나트륨', current: 45, max: 100, status: 'warning' },
        { name: '가성소다', current: 15, max: 100, status: 'danger' },
        { name: '황산알루미늄', current: 95, max: 100, status: 'safe' },
    ];

    const getStatusColor = (status: string) => {
        if (status === 'safe') return 'bg-green-500';
        if (status === 'warning') return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-6 rounded-lg font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="전체 품목 수" value="12" icon={<Package size={24} className="text-blue-500"/>} colorClass="border-blue-500" />
                <StatCard title="금일 입고량" value="150 kg" icon={<ArrowDown size={24} className="text-green-500"/>} colorClass="border-green-500" />
                <StatCard title="금일 출고량" value="80 kg" icon={<ArrowUp size={24} className="text-red-500"/>} colorClass="border-red-500" />
                <StatCard title="안전재고 도달" value="3 품목" icon={<AlertTriangle size={24} className="text-yellow-500"/>} colorClass="border-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2 text-sm"><BarChart size={16}/> 품목별 재고 현황</h3>
                    <div className="space-y-3">
                        {inventoryStatus.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-medium text-slate-700 dark:text-slate-300 text-xs">{item.name}</p>
                                    <p className="font-semibold text-slate-800 dark:text-white text-xs">{item.current} / {item.max} kg</p>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div className={`${getStatusColor(item.status)} h-2 rounded-full`} style={{ width: `${(item.current / item.max) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2 text-sm"><Bell size={16}/> 주요 공지사항</h3>
                    <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-xs">
                        <li className="flex items-start gap-2">
                            <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0"/> 
                            <span>[시스템] v1.2 업데이트 완료 (2023-10-26)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <AlertTriangle size={14} className="text-yellow-500 mt-0.5 shrink-0"/> 
                            <span>[공지] A동 창고 정기 재물 조사 예정 (2023-11-05)</span>
                        </li>
                        <li className="flex items-start gap-2">
                           <Package size={14} className="text-blue-500 mt-0.5 shrink-0"/>
                           <span>[입고] 신규 품목 &apos;응집제-S&apos; 입고 완료</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardUI;
