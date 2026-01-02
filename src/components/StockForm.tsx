import React, { useState, useEffect, useMemo } from 'react';
import { InventoryItem, Category } from '../types';
import { Save, X, Trash2, Box, Tag, Layers, MapPin, AlertCircle, Type, Factory, Ruler } from 'lucide-react';
import ComboBox from './ComboBox';
import { DEFAULT_LOCATIONS } from '../constants';

interface StockFormProps {
  item?: InventoryItem;
  inventory: InventoryItem[];
  onSave: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const StockForm: React.FC<StockFormProps> = ({ item, inventory, onSave, onDelete, onCancel }) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    category: item?.category || Category.ELECTRIC,
    name: item?.name || '',
    standard: item?.standard || '',
    model: item?.model || '',
    manufacturer: item?.manufacturer || '',
    unit: item?.unit || 'EA',
    currentStock: item?.currentStock || 0,
    safeStock: item?.safeStock || 0,
    location: item?.location || '',
    note: item?.note || ''
  });

  useEffect(() => {
    if (item) {
      setFormData({...item});
    } else {
      // Reset form for new item, keeping default category
      setFormData({
        category: Category.ELECTRIC, name: '', standard: '', model: '', manufacturer: '',
        unit: 'EA', currentStock: 0, safeStock: 0, location: '', note: ''
      });
    }
  }, [item]);

  // --- Intelligent Filtering Logic ---
  const categoryOptions = useMemo(() => Object.values(Category), []);

  const nameOptions = useMemo(() => {
    if (!formData.category) return [];
    return Array.from(new Set(inventory
      .filter(i => i.category === formData.category)
      .map(i => i.name)));
  }, [inventory, formData.category]);

  const standardOptions = useMemo(() => {
    if (!formData.category || !formData.name) return [];
    return Array.from(new Set(inventory
      .filter(i => i.category === formData.category && i.name === formData.name)
      .map(i => i.standard).filter(Boolean)));
  }, [inventory, formData.category, formData.name]);

  const modelOptions = useMemo(() => {
    if (!formData.category || !formData.name) return []; // Standard is optional
    let filtered = inventory.filter(i => i.category === formData.category && i.name === formData.name);
    if(formData.standard) {
      filtered = filtered.filter(i => i.standard === formData.standard);
    }
    return Array.from(new Set(filtered.map(i => i.model).filter(Boolean)));
  }, [inventory, formData.category, formData.name, formData.standard]);

  const manufacturerOptions = useMemo(() => {
    if (!formData.category || !formData.name) return []; // Standard/Model are optional
    let filtered = inventory.filter(i => i.category === formData.category && i.name === formData.name);
    if(formData.standard) {
      filtered = filtered.filter(i => i.standard === formData.standard);
    }
    if(formData.model) {
      filtered = filtered.filter(i => i.model === formData.model);
    }
    return Array.from(new Set(filtered.map(i => i.manufacturer).filter(Boolean)));
  }, [inventory, formData.category, formData.name, formData.standard, formData.model]);

  const locationOptions = useMemo(() => {
    const allLocations = inventory.map(i => i.location).filter(Boolean);
    return Array.from(new Set([...DEFAULT_LOCATIONS, ...allLocations]));
  }, [inventory]);


  // --- Hierarchical State Reset ---
  useEffect(() => {
    if (item) return; // Don't auto-clear fields when editing
    setFormData(prev => ({ ...prev, name: '', standard: '', model: '', manufacturer: '' }));
  }, [formData.category, item]);

  useEffect(() => {
    if (item) return;
    setFormData(prev => ({ ...prev, standard: '', model: '', manufacturer: '' }));
  }, [formData.name, item]);
  
  useEffect(() => {
    if (item) return;
    setFormData(prev => ({ ...prev, model: '', manufacturer: '' }));
  }, [formData.standard, item]);
  
  useEffect(() => {
    if (item) return;
    setFormData(prev => ({ ...prev, manufacturer: '' }));
  }, [formData.model, item]);


  const handleChange = (field: keyof InventoryItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (field === 'currentStock' || field === 'safeStock') ? (parseFloat(value as string) || 0) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('품목명은 필수 항목입니다.');
      return;
    }
    const newItem: InventoryItem = {
      id: item?.id || `INV-${Date.now()}`,
      category: formData.category || Category.ETC,
      name: formData.name || '',
      standard: formData.standard || '',
      model: formData.model || '',
      manufacturer: formData.manufacturer || '',
      unit: formData.unit || 'EA',
      currentStock: formData.currentStock || 0,
      safeStock: formData.safeStock || 0,
      location: formData.location || '',
      note: formData.note || '',
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    onSave(newItem);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 rounded-t-xl">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            {item ? <Edit3Icon /> : <Box className="text-blue-600" />}
            {item ? '재고 품목 수정' : '신규 품목 등록'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><X size={24} /></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="stock-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">대분류</label>
                <ComboBox
                  options={categoryOptions}
                  value={formData.category || ''}
                  onChange={(val) => handleChange('category', val)}
                  icon={<Layers size={16} />}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">품목명 <span className="text-red-500">*</span></label>
                <ComboBox
                  options={nameOptions}
                  value={formData.name || ''}
                  onChange={(val) => handleChange('name', val)}
                  placeholder="예: MCCB 배선용차단기"
                  icon={<Tag size={16} />}
                  disabled={!formData.category}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">규격</label>
              <ComboBox
                options={standardOptions}
                value={formData.standard || ''}
                onChange={(val) => handleChange('standard', val)}
                placeholder="예: 630A 4P"
                icon={<Ruler size={16} />}
                disabled={!formData.name}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">품번 (비고)</label>
                 <ComboBox
                  options={modelOptions}
                  value={formData.model || ''}
                  onChange={(val) => handleChange('model', val)}
                  placeholder="예: ABS 604C"
                  icon={<Type size={16} />}
                  disabled={!formData.name}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">제조사</label>
                <ComboBox
                  options={manufacturerOptions}
                  value={formData.manufacturer || ''}
                  onChange={(val) => handleChange('manufacturer', val)}
                  placeholder="예: LS, 현대, 삼영"
                  icon={<Factory size={16} />}
                  disabled={!formData.name}
                />
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
               <div className="col-span-1">
                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">현재고</label>
                 <input type="number" name="currentStock" step="1" value={formData.currentStock || 0} onChange={(e) => handleChange('currentStock', e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-lg text-blue-600 bg-white dark:bg-slate-700 dark:text-white text-right"/>
               </div>
               <div className="col-span-1">
                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">단위</label>
                 <input type="text" name="unit" value={formData.unit || 'EA'} onChange={(e) => handleChange('unit', e.target.value)} placeholder="EA" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-center bg-white dark:bg-slate-700 dark:text-white"/>
               </div>
               <div className="col-span-1 md:col-span-2">
                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">적정재고 <AlertCircle size={12} /></label>
                 <div className="flex items-center gap-2">
                   <input type="number" name="safeStock" step="1" value={formData.safeStock || 0} onChange={(e) => handleChange('safeStock', e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white text-right"/>
                   <span className="text-xs text-slate-400 whitespace-nowrap">미만 시 알림</span>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">보관장소</label>
                <ComboBox
                  options={locationOptions}
                  value={formData.location || ''}
                  onChange={(val) => handleChange('location', val)}
                  placeholder="예: 1층 자재창고"
                  icon={<MapPin size={16} />}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">기타사항</label>
                <input type="text" name="note" value={formData.note || ''} onChange={(e) => handleChange('note', e.target.value)} placeholder="메모 입력" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"/>
              </div>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex justify-between items-center rounded-b-xl">
           {item ? (
             <button type="button" onClick={() => { if (window.confirm('정말 삭제하시겠습니까?')) { onDelete(item.id); onCancel(); } }} className="text-red-500 hover:text-red-700 flex items-center gap-2 px-3 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
               <Trash2 size={18} /> <span className="text-sm font-bold">삭제</span>
             </button>
           ) : ( <div></div> )}
           <div className="flex gap-3">
             <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold transition-colors">
               취소
             </button>
             <button type="submit" form="stock-form" className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
               <Save size={18} /> 저장
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const Edit3Icon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>);

export default StockForm;