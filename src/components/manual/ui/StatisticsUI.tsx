// import React from 'react'; // 최신 React/Vite에서는 불필요하여 주석 처리 (TS6133)
import { BarChart, PieChart, TrendingUp, TrendingDown, Archive, AlertTriangle } from 'lucide-react';

const StatisticsUI = () => {

    // Dummy data for charts
    const barChartData = [ { month: '7월', in: 1200, out: 900 }, { month: '8월', in: 1500, out: 1100 }, { month: '9월', in: 1800, out: 1600 }, { month: '10월', in: 1300, out: 1400 }];
    const pieChartData = [ { name: '응집제', value: 45, color: '#3b82f6' }, { name: '살균소독제', value: 25, color: '#10b981' }, { name: 'pH조정제', value: 20, color: '#f97316' }, { name: '기타', value: 10, color: '#6b7280' } ];

    let accumulated = 0;
    const pieChartSegments = pieChartData.map(p => {
        const dasharray = 2 * Math.PI * 45;
        const dashoffset = dasharray * (1 - (p.value/100));
        const rotation = accumulated * 3.6;
        accumulated += p.value;
        return { ...p, dasharray, dashoffset, rotation };
    });

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-slate-700 w-full font-sans select-none">
             {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                    <TrendingUp size={32} className="text-blue-500"/>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">총 입고량 (월)</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-100">1,300 kg</p>
                    </div>
                </div>
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                    <TrendingDown size={32} className="text-slate-500"/>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">총 출고량 (월)</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-100">1,400 kg</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                    <Archive size={32} className="text-green-500"/>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">총 품목 수</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-100">27 개</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-amber-400/50 dark:border-amber-600/50 flex items-center gap-4">
                    <AlertTriangle size={32} className="text-amber-500"/>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">안전재고 부족</p>
                        <p className="text-xl font-bold text-amber-500">3 건</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Bar Chart */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4"><BarChart size={18}/>월별 입/출고 현황</h4>
                    <div className="h-64 flex items-end justify-around px-2 text-xs text-slate-500">
                        {barChartData.map(d => (
                            <div key={d.month} className="w-1/5 flex flex-col items-center">
                                <div className="w-full flex justify-around items-end h-full">
                                     <div className="w-8 bg-blue-400 dark:bg-blue-500 rounded-t-sm" style={{height: `${(d.in / 2000) * 100}%`}}></div>
                                     <div className="w-8 bg-slate-300 dark:bg-slate-600 rounded-t-sm" style={{height: `${(d.out / 2000) * 100}%`}}></div>
                                </div>
                                <span className="mt-2 font-semibold">{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4"><PieChart size={18}/>품목별 재고 구성비</h4>
                    <div className="h-64 flex items-center justify-center">
                        <div className="relative w-48 h-48 rounded-full flex items-center justify-center">
                           {/* Simple SVG Pie Chart */}
                           <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10"/>
                                {pieChartSegments.map(p => (
                                    <circle key={p.name} cx="50" cy="50" r="45" fill="none" stroke={p.color} strokeWidth="10" strokeDasharray={p.dasharray} strokeDashoffset={p.dashoffset} className="transform-gpu" style={{transform: `rotate(${p.rotation}deg)`, transformOrigin: '50% 50%'}}/>
                                ))}
                           </svg>
                           <div className="absolute text-center">
                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">5.2 T</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">총 재고</p>
                           </div>
                        </div>
                    </div>
                    <div className="mt-4 text-xs space-y-2">
                        {pieChartData.map(p => (
                            <div key={p.name} className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{backgroundColor: p.color}}></span>{p.name}</span>
                                <span className="font-bold">{p.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatisticsUI;
