// import React from 'react';
import { BarChart, PieChart, LineChart, Bar, Pie, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Package, Calendar } from 'lucide-react';

const monthlyData = [
    { name: '1월', 입고: 400, 출고: 240 },
    { name: '2월', 입고: 300, 출고: 139 },
    { name: '3월', 입고: 200, 출고: 980 },
    { name: '4월', 입고: 278, 출고: 390 },
    { name: '5월', 입고: 189, 출고: 480 },
    { name: '6월', 입고: 239, 출고: 380 },
];

const categoryData = [
    { name: '응집제', value: 400 },
    { name: '살균소독제', value: 300 },
    { name: 'pH조정제', value: 300 },
    { name: '기타', value: 200 },
];

const itemHistoryData = [
  { date: '10-01', 재고량: 65 },
  { date: '10-08', 재고량: 62 },
  { date: '10-15', 재고량: 70 },
  { date: '10-22', 재고량: 55 },
  { date: '10-29', 재고량: 60 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalysisUI = () => {
    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-6 rounded-lg font-sans text-xs space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <select className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs">
                    <option>기간 선택: 전체</option>
                    <option>최근 3개월</option>
                    <option>최근 6개월</option>
                </select>
                 <select className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs">
                    <option>품목 선택: 폴리염화알루미늄</option>
                    <option>차아염소산나트륨</option>
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly I/O Trend */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Calendar size={16}/> 월별 입/출고량 추이</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="name" fontSize={11} />
                            <YAxis fontSize={11} />
                            <Tooltip formatter={(value) => `${value} kg`} />
                            <Legend />
                            <Bar dataKey="입고" fill="#8884d8" />
                            <Bar dataKey="출고" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                     <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Package size={16}/> 카테고리별 재고 비중</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(entry) => `${entry.name} (${entry.value})`}>
                                {categoryData.map((_entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} kg`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                 <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><TrendingUp size={16}/> 특정 품목 재고량 추이 (폴리염화알루미늄)</h3>
                 <ResponsiveContainer width="100%" height={250}>
                     <LineChart data={itemHistoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)"/>
                        <XAxis dataKey="date" fontSize={11}/>
                        <YAxis fontSize={11} domain={['dataMin - 10', 'dataMax + 10']}/>
                        <Tooltip formatter={(value) => `${value} kg`}/>
                        <Legend />
                        <Line type="monotone" dataKey="재고량" stroke="#ff7300" activeDot={{ r: 8 }} />
                     </LineChart>
                 </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalysisUI;
