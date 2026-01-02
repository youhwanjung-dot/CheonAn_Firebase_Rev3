import React, { useState, useMemo, useEffect } from 'react';
import { InventoryItem, InventoryTransaction, User } from '../types';
import { X, ArrowUpCircle, ArrowDownCircle, Trash2, Save, FileText, Check, AlertCircle, Search, RotateCcw, PlusIcon /*, Calendar*/ } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

interface TransactionModalProps {
  item: InventoryItem;
  transactions: InventoryTransaction[];
  currentUser: User;
  users: User[];
  onSave: (tx: Omit<InventoryTransaction, 'id' | 'currentStockSnapshot'>) => void;
  onUpdate: (oldTx: InventoryTransaction, newTx: Partial<InventoryTransaction>) => void;
  onDelete: (tx: InventoryTransaction) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

const DEFAULT_SITES = [
  "1단계 공정설비",
  "2단계 공정설비",
  "3단계 공정설비",
  "4단계 공정설비",
  "신설 통합침사지",
  "신설 1.5단계 공정설비",
  "신설 2단계 공정설비"
];

const TransactionModal: React.FC<TransactionModalProps> = ({ 
  item, 
  transactions, 
  currentUser, 
  users, 
  onSave, 
  onUpdate, 
  onDelete, 
  onClearHistory,
  onClose 
}) => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [quantity, setQuantity] = useState('1');
  const [worker, setWorker] = useState(currentUser.name);
  const [department, setDepartment] = useState(DEFAULT_SITES[0]);
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [reason, setReason] = useState('구매입고');
  const [viewPeriod, setViewPeriod] = useState<'MONTH' | 'YEAR'>('MONTH');
  const [targetMonth, setTargetMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!selectedTxId) {
      if (type === 'IN') setReason('구매입고');
      else setReason('현장사용');
    }
  }, [type, selectedTxId]);

  useEffect(() => {
    if (date.length >= 7) {
      setTargetMonth(date.slice(0, 7));
    }
  }, [date]);

  const availableSites = useMemo(() => {
    const historySites = new Set(transactions.map(t => t.department).filter(Boolean));
    DEFAULT_SITES.forEach(s => historySites.add(s));
    return Array.from(historySites).sort();
  }, [transactions]);

  const itemTransactions = useMemo(() => {
    let filtered = transactions.filter(t => t.itemId === item.id);
    if (viewPeriod === 'MONTH') {
      filtered = filtered.filter(t => t.date.startsWith(targetMonth));
    } else {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const oneYearAgoStr = oneYearAgo.toISOString().slice(0, 10);
      filtered = filtered.filter(t => t.date >= oneYearAgoStr);
    }
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, item.id, viewPeriod, targetMonth]);

  const handleSelectTransaction = (tx: InventoryTransaction) => {
    setSelectedTxId(tx.id);
    setDate(tx.date);
    setType(tx.type);
    setQuantity(String(tx.quantity));
    setWorker(tx.worker);
    setReason(tx.reason);
    if (DEFAULT_SITES.includes(tx.department)) {
      setDepartment(tx.department);
      setIsDirectInput(false);
    } else {
      setDepartment(tx.department);
      setIsDirectInput(true);
    }
  };

  const handleReset = () => {
    setSelectedTxId(null);
    setQuantity('1');
    setDate(new Date().toISOString().slice(0, 10));
    setDepartment(DEFAULT_SITES[0]);
    setIsDirectInput(false);
    setType('IN');
    setReason(type === 'IN' ? '구매입고' : '현장사용');
  };
  
  const executeFormReset = () => {
    handleReset();
    setShowResetConfirm(false);
  }

  const handleDeleteCurrent = () => {
    if (!selectedTxId) return;
    const tx = transactions.find(t => t.id === selectedTxId);
    if (tx) {
      setShowDeleteConfirm(true);
    }
  };

  const executeDelete = () => {
    if (!selectedTxId) return;
    const tx = transactions.find(t => t.id === selectedTxId);
    if (tx) {
        onDelete(tx);
        handleReset();
    }
    setShowDeleteConfirm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      alert('유효한 수량을 입력해주세요.');
      return;
    }
    if (!department.trim()) {
      alert('사용현장을 입력해주세요.');
      return;
    }
    if (selectedTxId) {
      const originalTx = transactions.find(t => t.id === selectedTxId);
      if (originalTx) {
        onUpdate(originalTx, { date, type, quantity: qty, worker, department, reason });
        handleReset();
      }
    } else {
      onSave({ itemId: item.id, itemName: item.name, category: item.category, date, type, quantity: qty, worker, department, reason });
      handleReset();
    }
  };

  const currentMonthLabel = `${targetMonth.split('-')[0]}년 ${targetMonth.split('-')[1]}월`;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-6xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><FileText className="text-blue-600" />입출고 관리 및 이력</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={24} /></button>
          </div>
          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950">
            <div className="w-full lg:w-[380px] p-6 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto shrink-0 transition-colors">
              <h3 className={`font-bold flex items-center gap-2 mb-4 text-lg ${selectedTxId ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                {selectedTxId ? <><AlertCircle size={20} /> 내역 수정 및 삭제</> : <><PlusIcon size={20}/> 신규 내역 등록</>}
              </h3>
              <div className="flex gap-2 mb-6">
                <button type="button" onClick={() => setType('IN')} className={`flex-1 py-3 rounded-lg border-2 font-bold flex items-center justify-center gap-2 transition-all ${type === 'IN' ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'border-slate-200 text-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'}`}><ArrowUpCircle size={20} /> 입고 (채움)</button>
                <button type="button" onClick={() => setType('OUT')} className={`flex-1 py-3 rounded-lg border-2 font-bold flex items-center justify-center gap-2 transition-all ${type === 'OUT' ? 'border-slate-600 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200' : 'border-slate-200 text-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'}`}><ArrowDownCircle size={20} /> 출고 (사용)</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">📅 작업일자</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">📄 {type === 'IN' ? '입고' : '출고'} 수량</label>
                    <input type="number" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-right text-lg bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="0" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">👤 작업자</label>
                    <select value={worker} onChange={(e) => setWorker(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 appearance-none">
                      {users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">🏗️ 사용현장</label>
                    {!isDirectInput ? (
                      <select value={availableSites.includes(department) ? department : 'DIRECT'} onChange={(e) => { if (e.target.value === 'DIRECT') { setIsDirectInput(true); setDepartment(''); } else { setDepartment(e.target.value); } }} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 appearance-none">
                        {availableSites.map(site => <option key={site} value={site}>{site}</option>)}
                        <option value="DIRECT" className="font-bold text-blue-600">✎ 직접입력</option>
                      </select>
                    ) : (
                      <div className="flex gap-1">
                        <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="현장명 직접 입력" className="w-full px-3 py-2 border border-blue-500 dark:border-blue-400 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500" autoFocus />
                        <button type="button" onClick={() => { setIsDirectInput(false); setDepartment(DEFAULT_SITES[0]); }} className="px-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700" title="목록으로 돌아가기"><X size={14} /></button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">📝 사용내역(사유)</label>
                  <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="예: 정기 입고, 현장 소모 등" />
                </div>
                <div className="pt-6 flex flex-col gap-3">
                  <div className="flex gap-3">
                    {selectedTxId ? (
                      <>
                        <button type="button" onClick={handleReset} className="px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-800" title="신규 등록으로 전환"><RotateCcw size={20} /></button>
                        <button type="button" onClick={handleDeleteCurrent} className="px-4 py-3 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors" title="현재 내역 삭제"><Trash2 size={20} /></button>
                        <button type="submit" className="flex-1 py-3 text-white bg-orange-600 rounded-lg font-bold shadow-md flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors"><Save size={18} /> 수정 내용 저장</button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => setShowResetConfirm(true)} className="flex-1 py-3 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">초기화</button>
                        <button type="submit" className={`flex-[2] py-3 text-white rounded-lg font-bold shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity ${type === 'IN' ? 'bg-blue-600' : 'bg-slate-600'}`}><Check size={18} /> {type === 'IN' ? '입고 등록' : '출고 등록'}</button>
                      </>
                    )}
                  </div>
                  {currentUser.role === 'admin' && (
                    <button type="button" onClick={onClearHistory} className="w-full py-2 mt-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"><AlertCircle size={14} /> 이 품목의 전체 이력 삭제 (재고 0으로 초기화)</button>
                  )}
                </div>
              </form>
            </div>
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 flex-wrap">
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{item.category}</span>
                  <span className="text-slate-300">{'>'}</span>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{item.name}</h3>
                  {item.standard && <><span className="text-slate-300 mx-1">|</span><span className="font-bold text-slate-600 dark:text-slate-300 text-sm bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">{item.standard}</span></>
}
                  <span className="text-slate-300 mx-1">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">현재고:</span>
                    <span className="text-lg font-bold text-blue-600">{item.currentStock}</span>
                    <span className="text-sm font-bold text-slate-400">{item.unit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 hidden sm:inline-block">{viewPeriod === 'MONTH' ? currentMonthLabel : '최근 1년'}</span>
                  <button onClick={() => setViewPeriod(prev => prev === 'MONTH' ? 'YEAR' : 'MONTH')} className="px-3 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">{viewPeriod === 'MONTH' ? '📅 1년 전체보기' : '📆 이번달 보기'}</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    <tr>
                      <th className="px-4 py-3 border-b dark:border-slate-700">날짜</th>
                      <th className="px-4 py-3 border-b dark:border-slate-700 text-center">구분</th>
                      <th className="px-4 py-3 border-b dark:border-slate-700 text-right">수량</th>
                      <th className="px-4 py-3 border-b dark:border-slate-700 text-right">재고</th>
                      <th className="px-4 py-3 border-b dark:border-slate-700">작업자</th>
                      <th className="px-4 py-3 border-b dark:border-slate-700 text-center">비고</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {itemTransactions.length === 0 ? (
                      <tr><td colSpan={6} className="py-20 text-center text-slate-400"><div className="flex flex-col items-center gap-3"><Search size={48} className="text-slate-200 dark:text-slate-700" /><p>해당 기간에 추가 거래 이력이 없습니다.</p></div></td></tr>
                    ) : (
                      itemTransactions.map((tx) => (
                        <tr key={tx.id} onClick={() => handleSelectTransaction(tx)} className={`cursor-pointer transition-colors ${selectedTxId === tx.id ? 'bg-orange-50 dark:bg-orange-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono">{tx.date}</td>
                          <td className="px-4 py-3 text-center"><span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${tx.type === 'IN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>{tx.type === 'IN' ? '입고' : '출고'}</span></td>
                          <td className={`px-4 py-3 text-right font-bold ${tx.type === 'IN' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>{tx.type === 'IN' ? '+' : '-'}{tx.quantity}</td>
                          <td className="px-4 py-3 text-right text-slate-500 dark:text-slate-400 font-mono">{tx.currentStockSnapshot !== undefined ? tx.currentStockSnapshot.toFixed(0) : '-'}</td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300"><div className="truncate w-20" title={`${tx.worker} / ${tx.department}`}>{tx.worker}</div></td>
                          <td className="px-4 py-3 text-center text-slate-400 text-xs">{selectedTxId === tx.id ? <span className="text-orange-600 font-bold">선택됨</span> : '클릭하여 수정'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showResetConfirm && (
        <ConfirmationModal
          title="입력 초기화"
          message="정말로 작성중인 내용을 모두 초기화하시겠습니까?"
          onConfirm={executeFormReset}
          onCancel={() => setShowResetConfirm(false)}
          confirmLabel="초기화"
        />
      )}
      {showDeleteConfirm && (
        <ConfirmationModal
          title="이력 삭제"
          message="정말 이 이력을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          onConfirm={executeDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          confirmLabel="삭제"
          isDangerous={true}
        />
      )}
    </>
  );
};

export default TransactionModal;
