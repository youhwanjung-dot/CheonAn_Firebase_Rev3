import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { AlertTriangle, Package, Archive, TrendingDown } from 'lucide-react';
import { InventoryItem } from '../types';

interface DashboardProps {
  items: InventoryItem[];
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ items, isDarkMode }) => {
  // KPI Calculations
  const totalItems = items.length;
  const lowStockItems = items.filter(i => i.currentStock < i.safeStock);
  const totalStockCount = items.reduce((acc, curr) => acc + curr.currentStock, 0);
  
  // Dynamic Category Stats
  const categoryData = useMemo(() => {
    // 1. Get unique categories present in the data
    const categories = Array.from(new Set(items.map(i => i.category).filter(Boolean)));
    
    // 2. Calculate stats for each category
    return categories.map(cat => ({
      name: cat,
      count: items.filter(i => i.category === cat).length,
      stock: Math.round(items.filter(i => i.category === cat).reduce((acc, i) => acc + i.currentStock, 0))
    })).sort((a, b) => b.count - a.count); // Sort by item count descending
  }, [items]);

  const lowStockData = lowStockItems.map(i => ({
    name: i.name,
    current: Math.round(i.currentStock),
    safe: i.safeStock,
    shortage: Math.round(i.safeStock - i.currentStock)
  }));

  // Chart Theme Colors
  const chartTheme = {
    grid: isDarkMode ? "#334155" : "#e2e8f0", // slate-700 : slate-200
    text: isDarkMode ? "#94a3b8" : "#64748b", // slate-400 : slate-500
    tooltipBg: isDarkMode ? "#1e293b" : "rgba(255, 255, 255, 0.95)", // slate-800 : white
    tooltipBorder: isDarkMode ? "#334155" : "none", // slate-700 : none
    tooltipText: isDarkMode ? "#f1f5f9" : "#1e293b", // slate-100 : slate-900
    tooltipShadow: isDarkMode ? '0 10px 15px -3px rgb(0 0 0 / 0.5)' : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center transition-colors">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mr-4">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">총 관리 품목</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalItems}개</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center transition-colors">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 mr-4">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">부족/위험 재고</p>
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">{lowStockItems.length}개</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center transition-colors">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 mr-4">
            <Archive size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">총 재고 수량</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {totalStockCount.toLocaleString()}
            </h3>
          </div>
        </div>

         <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center transition-colors">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 mr-4">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">재고 확보율</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {totalItems === 0 ? 0 : Math.round(((totalItems - lowStockItems.length) / totalItems) * 100)}%
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">카테고리별 품목 현황</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                <XAxis 
                  dataKey="name" 
                  tick={{fontSize: 12, fill: chartTheme.text}} 
                  axisLine={{ stroke: chartTheme.grid }} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{fill: chartTheme.text}} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: isDarkMode ? `1px solid ${chartTheme.tooltipBorder}` : 'none', 
                    boxShadow: chartTheme.tooltipShadow, 
                    backgroundColor: chartTheme.tooltipBg,
                    color: chartTheme.tooltipText
                  }}
                  itemStyle={{ color: chartTheme.tooltipText }}
                  labelStyle={{ color: chartTheme.tooltipText, fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Legend />
                <Bar dataKey="count" name="품목 수" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">재고 부족 현황 (Top 5)</h3>
           <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lowStockData.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={chartTheme.grid} />
                <XAxis type="number" tick={{fill: chartTheme.text}} axisLine={{ stroke: chartTheme.grid }} tickLine={false} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  tick={{fontSize: 11, fill: chartTheme.text}} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: isDarkMode ? `1px solid ${chartTheme.tooltipBorder}` : 'none', 
                    boxShadow: chartTheme.tooltipShadow, 
                    backgroundColor: chartTheme.tooltipBg,
                    color: chartTheme.tooltipText
                  }}
                  itemStyle={{ color: chartTheme.tooltipText }}
                  labelStyle={{ color: chartTheme.tooltipText, fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Legend />
                <Bar dataKey="current" name="현재고" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="shortage" name="부족분" stackId="a" fill={isDarkMode ? "#334155" : "#e2e8f0"} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;