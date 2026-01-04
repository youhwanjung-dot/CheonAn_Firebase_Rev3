
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import './index.css';
import {
    LayoutDashboard,
    Package,
    BarChart2,
    FileSpreadsheet,
    LogOut,
    Menu,
    X,
    Users,
    History,
    Moon,
    Sun,
    Box,
    BookOpen
} from 'lucide-react';
// [Tauri Integration] Import fs and path modules from Tauri API
import { fs, path } from '@tauri-apps/api';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import StockForm from './components/StockForm';
import TransactionModal from './components/TransactionModal';
import ConfirmationModal from './components/ConfirmationModal';
import ManualModal from './components/ManualModal';
import LoadingFallback from './components/LoadingFallback';
import sortInventory from './utils/sortInventory';

// [Optimization] Lazy Load Heavy Components
const ExcelImport = React.lazy(() => import('./components/ExcelImport'));
const TransactionHistoryImport = React.lazy(() => import('./components/TransactionHistoryImport'));
const AIAdvisor = React.lazy(() => import('./components/AIAdvisor'));
const DataMigrationModal = React.lazy(() => import('./components/DataMigrationModal'));
const UserManagerModal = React.lazy(() => import('./components/UserManagerModal'));
const MasterDataManagerModal = React.lazy(() => import('./components/MasterDataManagerModal'));
const MonthlyReportModal = React.lazy(() => import('./components/MonthlyReportModal'));

import { InventoryItem, InventoryTransaction, User, ViewState } from './types';
import { APP_VERSION } from './constants';
import { ActionLogger } from './utils/logger';

const App = () => {
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [showStockForm, setShowStockForm] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);

    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [transactionItemId, setTransactionItemId] = useState<string | null>(null);

    const [showDBManager, setShowDBManager] = useState(false);
    const [showUserManager, setShowUserManager] = useState(false);
    const [showMasterDataManager, setShowMasterDataManager] = useState(false);
    const [showMonthlyReport, setShowMonthlyReport] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
    const [showManual, setShowManual] = useState(false);

    /* [Original Web-only Data Loading] - This code is preserved for reference.
    // [Web Preview Fix] Re-enabled fetch for web development preview
    useEffect(() => {
        const fetchData = async () => {
            try {
                // In web preview, data is fetched from the /public folder
                const response = await fetch('/database.json'); 
                const data = await response.json();
                setInventory(sortInventory(data.inventory || []));
                setTransactions(data.transactions || []);
                setUsers(data.users || []);
            } catch (error) {
                console.error("Web Preview: Failed to fetch initial data:", error);
            } finally {
                setIsDataLoaded(true);
            }
        };

        fetchData();
    }, []);
    */

    // [Tauri Integration] Hybrid data loading for both Tauri and Web environments
    useEffect(() => {
        const DATA_FILE_NAME = 'database.json';

        const initializeData = async () => {
            try {
                let data;
                // If in Tauri environment, use file system
                if (window.__TAURI__) {
                    const appDataDirPath = await path.appDataDir();
                    if (!(await fs.exists(appDataDirPath))) {
                        await fs.createDir(appDataDirPath);
                    }
                    const filePath = await path.join(appDataDirPath, DATA_FILE_NAME);

                    let fileContent;
                    if (await fs.exists(filePath)) {
                        // If user's data file exists, load it
                        fileContent = await fs.readTextFile(filePath);
                    } else {
                        // If not, load the initial database from resources and copy to appDataDir
                        const resourcePath = await path.resolveResource(DATA_FILE_NAME);
                        fileContent = await fs.readTextFile(resourcePath);
                        await fs.writeFile({ path: filePath, contents: fileContent });
                    }
                    data = JSON.parse(fileContent);

                } else {
                    // If in web browser, fetch from public folder
                    const response = await fetch('/database.json');
                    data = await response.json();
                }

                setInventory(sortInventory(data.inventory || []));
                setTransactions(data.transactions || []);
                setUsers(data.users || []);

            } catch (error) {
                console.error("Hybrid Data Load: Failed to initialize data:", error);
            } finally {
                setIsDataLoaded(true);
            }
        };

        initializeData();
    }, []);


    // [Tauri Integration] Enabled Tauri-specific data saving logic
    useEffect(() => {
        // Only run this effect in a Tauri environment after initial data is loaded
        if (!isDataLoaded || !window.__TAURI__) return;

        const handler = setTimeout(async () => {
            try {
                const appDataDirPath = await path.appDataDir();
                const filePath = await path.join(appDataDirPath, 'database.json');
                
                const payload = {
                    inventory,
                    transactions,
                    users
                };

                await fs.writeFile({
                    path: filePath,
                    contents: JSON.stringify(payload, null, 2)
                });
                 console.log("Data saved successfully to:", filePath);
            } catch (error) {
                console.error("Tauri: Failed to save data:", error);
            }
        }, 1000); // Debounce saving to avoid excessive writes

        return () => {
            clearTimeout(handler);
        };
    }, [inventory, transactions, users, isDataLoaded]);


    // Theme persistence
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        ActionLogger.log('User Logged In', { user: loggedInUser.name });
    };

    const handleLogout = () => {
        setUser(null);
        setCurrentView('DASHBOARD');
        setShowLogoutConfirm(false);
        ActionLogger.log('User Logged Out');
    };

    const handleAddItem = () => {
        setEditingItem(undefined);
        setShowStockForm(true);
    };

    const handleEditItem = (id: string) => {
        const item = inventory.find(i => i.id === id);
        if (item) {
            setEditingItem(item);
            setShowStockForm(true);
        }
    };

    const handleDeleteItem = (id: string) => {
        setInventory(prev => sortInventory(prev.filter(item => item.id !== id)));
        ActionLogger.log('Inventory Item Deleted', { id });
    };

    const handleSaveItem = (item: InventoryItem) => {
        setInventory(prev => {
            const exists = prev.some(i => i.id === item.id);
            const newInventory = exists
                ? prev.map(i => (i.id === item.id ? item : i))
                : [item, ...prev];
            return sortInventory(newInventory);
        });
        setShowStockForm(false);
    };

    const executeReset = async () => {
        try {
            let data;
            if (window.__TAURI__) {
                // Tauri environment: Read original data from resources
                const resourcePath = await path.resolveResource('database.json');
                const fileContent = await fs.readTextFile(resourcePath);
                data = JSON.parse(fileContent);

                // Overwrite the user's current database with the original one
                const appDataDirPath = await path.appDataDir();
                const filePath = await path.join(appDataDirPath, 'database.json');
                await fs.writeFile({ path: filePath, contents: fileContent });

            } else {
                /* [Original Web-only Reset]
                 const response = await fetch('/database.json');
                 data = await response.json();
                */
                // Web environment: Refetch the original data
                const response = await fetch('/database.json');
                data = await response.json();
            }
             setInventory(sortInventory(data.inventory || []));
             setTransactions(data.transactions || []);
             setUsers(data.users || []);

        } catch (error) {
            console.error("Hybrid Reset: Failed to reset database:", error);
        }
        setShowResetConfirm(false);
        ActionLogger.log('System Database Reset');
    };

    const handleTransactionSave = (tx: Omit<InventoryTransaction, 'id' | 'currentStockSnapshot'>) => {
        const itemToUpdate = inventory.find(i => i.id === tx.itemId);
        if (!itemToUpdate) return;

        const newStock = itemToUpdate.currentStock + (tx.type === 'IN' ? tx.quantity : -tx.quantity);
        const newTx = { ...tx, id: `TX-${Date.now()}`, currentStockSnapshot: newStock };

        setInventory(prev => prev.map(i => i.id === tx.itemId ? { ...i, currentStock: newStock } : i));
        setTransactions(prev => [newTx, ...prev]);
    };

    const handleTransactionUpdate = (oldTx: InventoryTransaction, updates: Partial<InventoryTransaction>) => {
        const newTx = { ...oldTx, ...updates };

        const oldImpact = oldTx.type === 'IN' ? oldTx.quantity : -oldTx.quantity;
        const newImpact = newTx.type === 'IN' ? newTx.quantity : -newTx.quantity;
        const stockDifference = newImpact - oldImpact;

        setInventory(prev =>
            prev.map(item =>
                item.id === oldTx.itemId
                    ? { ...item, currentStock: item.currentStock + stockDifference }
                    : item
            )
        );

        setTransactions(prev =>
            prev.map(t => (t.id === oldTx.id ? newTx : t))
        );
    };

    const handleTransactionDelete = (txToDelete: InventoryTransaction) => {
        const stockImpact = txToDelete.type === 'IN' ? -txToDelete.quantity : txToDelete.quantity;

        setInventory(prev =>
            prev.map(item =>
                item.id === txToDelete.itemId
                    ? { ...item, currentStock: item.currentStock + stockImpact }
                    : item
            )
        );

        setTransactions(prev => prev.filter(t => t.id !== txToDelete.id));
    };

    const handleClearItemHistory = () => {
        if (!transactionItemId) return;

        setTransactions(prev => prev.filter(tx => tx.itemId !== transactionItemId));

        setShowClearHistoryConfirm(false);
        setShowTransactionModal(false);
        ActionLogger.log('Item History Cleared', { itemId: transactionItemId });
    };

    const transactionItem = useMemo(() =>
        inventory.find(i => i.id === transactionItemId),
        [inventory, transactionItemId]
    );

    const sortedInventory = useMemo(() => sortInventory([...inventory]), [inventory]);

    if (!isDataLoaded) {
        return <LoadingFallback />;
    }

    if (!user) {
        return <Login users={users} onLogin={handleLogin} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />;
    }

    const menuItems = [
        { id: 'DASHBOARD', label: '대시 보드', icon: LayoutDashboard },
        { id: 'INVENTORY', label: '재고 현황', icon: Package },
        { id: 'ANALYSIS', label: '재고 분석', icon: BarChart2 },
        { id: 'IMPORT', label: '일괄 등록', icon: FileSpreadsheet },
        { id: 'HISTORY_IMPORT', label: '수불부 등록', icon: History },
    ];

    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-950 transition-colors overflow-hidden font-sans">
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-20 shadow-xl`}>
                <div className="p-4 h-16 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
                    {isSidebarOpen && <span className="font-bold text-xl text-blue-600 dark:text-blue-400 whitespace-nowrap">천안수질<span className="text-slate-400 font-normal">재고</span></span>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id as ViewState)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                                currentView === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <item.icon size={22} className={currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-500 transition-colors'} />
                            {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                        </button>
                    ))}
                </nav>
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1 shrink-0">
                    {user.role === 'admin' && (
                        <>
                            <button onClick={() => setShowMasterDataManager(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                <Box size={20} className="text-indigo-500" />
                                {isSidebarOpen && <span className="text-sm">기준정보 관리</span>}
                            </button>
                            <button onClick={() => setShowUserManager(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                <Users size={20} className="text-slate-500" />
                                {isSidebarOpen && <span className="text-sm">사용자 관리</span>}
                            </button>
                            <button onClick={() => setShowManual(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                <BookOpen size={20} className="text-emerald-500" />
                                {isSidebarOpen && <span className="text-sm">시스템 매뉴얼</span>}
                            </button>
                        </>
                    )}
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-400" />}
                        {isSidebarOpen && <span className="text-sm">{isDarkMode ? '라이트 모드' : '다크 모드'}</span>}
                    </button>
                    <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-bold text-sm">로그아웃</span>}
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-slate-950">
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">{menuItems.find(i => i.id === currentView)?.label}</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.role === 'admin' ? '시스템 관리자' : '일반 사용자'}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold border border-slate-200 dark:border-slate-700">
                            {user.name[0]}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden p-4 sm:p-6 relative">
                    <Suspense fallback={<LoadingFallback />}>
                        {currentView === 'DASHBOARD' && <Dashboard items={sortedInventory} isDarkMode={isDarkMode} />}
                        {currentView === 'INVENTORY' && <InventoryList items={sortedInventory} user={user} onAdd={handleAddItem} onEdit={handleEditItem} onDelete={handleDeleteItem} onReset={() => setShowResetConfirm(true)} onTransaction={(item) => { setTransactionItemId(item.id); setShowTransactionModal(true); }} onOpenMonthlyReport={() => setShowMonthlyReport(true)} onOpenDBManager={() => setShowDBManager(true)} />}
                        {currentView === 'ANALYSIS' && <AIAdvisor items={sortedInventory} transactions={transactions} />}
                        {currentView === 'IMPORT' && <ExcelImport onImport={(items) => { setInventory(prev => sortInventory([...prev, ...items])); setCurrentView('INVENTORY'); }} onCancel={() => setCurrentView('INVENTORY')} currentInventory={inventory} />}
                        {currentView === 'HISTORY_IMPORT' && <TransactionHistoryImport onImport={(txs) => { setTransactions(prev => [...txs, ...prev]); setCurrentView('INVENTORY'); }} onCancel={() => setCurrentView('INVENTORY')} inventory={inventory} />}
                    </Suspense>
                </div>
            </main>

            {showStockForm && <StockForm item={editingItem} inventory={inventory} onSave={handleSaveItem} onDelete={handleDeleteItem} onCancel={() => setShowStockForm(false)} />}

            {showTransactionModal && transactionItem && <TransactionModal
                item={transactionItem}
                transactions={transactions}
                currentUser={user}
                users={users}
                onSave={handleTransactionSave}
                onUpdate={handleTransactionUpdate}
                onDelete={handleTransactionDelete}
                onClearHistory={() => setShowClearHistoryConfirm(true)}
                onClose={() => setShowTransactionModal(false)}
            />}

            <Suspense fallback={null}>
                {showDBManager && <DataMigrationModal items={inventory} transactions={transactions} onImport={(data) => { setInventory(sortInventory(data.inventory)); setTransactions(data.transactions); }} onClose={() => setShowDBManager(false)} />}
                {showUserManager && <UserManagerModal users={users} currentUser={user} onUpdateUsers={setUsers} onClose={() => setShowUserManager(false)} />}
                {showMasterDataManager && <MasterDataManagerModal inventory={inventory} onUpdateInventory={(updated) => setInventory(sortInventory(updated))} onClose={() => setShowMasterDataManager(false)} />}
                {showMonthlyReport && <MonthlyReportModal items={sortedInventory} transactions={transactions} onClose={() => setShowMonthlyReport(false)} />}
            </Suspense>

            {showLogoutConfirm && <ConfirmationModal title="로그아웃 확인" message="로그아웃 하시겠습니까?" confirmLabel="로그아웃" onConfirm={handleLogout} onCancel={() => setShowLogoutConfirm(false)} />}
            {showResetConfirm && <ConfirmationModal title="DB 초기화" message="모든 데이터(재고, 수불, 사용자)가 영구적으로 삭제됩니다. 계속하시겠습니까?" confirmLabel="초기화" isDangerous onConfirm={executeReset} onCancel={() => setShowResetConfirm(false)} />}
            {showClearHistoryConfirm && transactionItem && <ConfirmationModal
                title="이력 전체 삭제"
                message={`'${transactionItem.name}' 품목의 모든 입출고 이력을 삭제합니다. 이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?`}
                confirmLabel="전체 삭제"
                isDangerous
                onConfirm={handleClearItemHistory}
                onCancel={() => setShowClearHistoryConfirm(false)}
            />}
            {showManual && <ManualModal onClose={() => setShowManual(false)} />}
            <div className="fixed bottom-2 right-2 text-[10px] text-slate-300 pointer-events-none z-50">v{APP_VERSION}</div>
        </div>
    );
};

export default App;