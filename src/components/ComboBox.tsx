import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

interface ComboBoxProps {
  options: string[];
  value: string; 
  onChange: (value: string) => void; 
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const ComboBox: React.FC<ComboBoxProps> = ({ options, value, onChange, placeholder, icon, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => options.filter(option => 
    option.toLowerCase().includes((value || '').toLowerCase())
  ), [options, value]);

  const handleSelectOption = (option: string) => {
    onChange(option); 
    setIsOpen(false); 
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value); 
      if(!isOpen) setIsOpen(true); 
  }

  const showCreateNewOption = value && !options.some(opt => opt.toLowerCase() === value.toLowerCase());

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</div>}
        <input
          type="text"
          value={value || ''} 
          onChange={handleInputChange} 
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 ${icon ? 'pl-9' : 'pl-4'} pr-8`}
        />
        <button 
          type="button" 
          onClick={() => setIsOpen(!isOpen)} 
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {isOpen && !disabled && (
        <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg">
           <ul className="max-h-52 overflow-y-auto custom-scrollbar p-1">
            {showCreateNewOption && (
                 <li
                    onMouseDown={() => handleSelectOption(value)}
                    className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-500 hover:text-white rounded-md cursor-pointer"
                >
                    직접입력: <span className='font-bold'>&quot;{value}&quot;</span>
                </li>
            )}
            
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <li
                  key={option}
                  onMouseDown={() => handleSelectOption(option)} 
                  className="px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-500 hover:text-white rounded-md cursor-pointer truncate"
                >
                  {option}
                </li>
              ))
            ) : (
                !showCreateNewOption && <li className="px-3 py-2 text-sm text-slate-400 italic">선택 가능한 항목이 없습니다.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComboBox;
