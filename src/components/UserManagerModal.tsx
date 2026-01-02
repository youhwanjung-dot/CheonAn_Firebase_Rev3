import React, { useState } from 'react';
import { User/*, UserRole*/ } from '../types';
import { X, UserPlus, Shield, Trash2, Save, Key, User as UserIcon, /*Check,*/ Edit2, Lock } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

interface UserManagerModalProps {
  users: User[];
  currentUser: User;
  onUpdateUsers: (users: User[]) => void;
  onClose: () => void;
}

const UserManagerModal: React.FC<UserManagerModalProps> = ({ users, currentUser, onUpdateUsers, onClose }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<User>({ id: '', name: '', password: '', role: 'user' });
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({ id: '', name: '', password: '', role: 'user' });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (user: User) => {
    setFormData({ ...user });
    setEditingId(user.id);
    setIsAdding(false);
  };

  const handleDeleteRequest = (userId: string) => {
    if (userId === currentUser.id) {
      alert('현재 로그인 중인 본인 계정은 삭제할 수 없습니다.');
      return;
    }
    if (users.length <= 1) {
      alert('최소 한 명의 사용자는 존재해야 합니다.');
      return;
    }
    setShowDeleteConfirm(userId);
  };

  const executeDelete = () => {
    if (showDeleteConfirm) {
        onUpdateUsers(users.filter(u => u.id !== showDeleteConfirm));
        setShowDeleteConfirm(null);
        if (editingId === showDeleteConfirm) resetForm();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAdding) {
        // Add Check
        if (users.some(u => u.id === formData.id)) {
            alert('이미 존재하는 ID입니다.');
            return;
        }
        onUpdateUsers([...users, formData]);
    } else {
        // Edit Save
        onUpdateUsers(users.map(u => u.id === formData.id ? formData : u));
    }
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Shield className="text-blue-600 dark:text-blue-400" />
            사용자 계정 관리
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* List Section */}
            <div className="flex-1 overflow-y-auto border-r border-slate-100 dark:border-slate-700 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300">등록된 사용자 ({users.length}명)</h3>
                    <button 
                        onClick={() => { resetForm(); setIsAdding(true); }}
                        className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1.5 rounded flex items-center gap-1 hover:bg-blue-200 transition-colors"
                    >
                        <UserPlus size={14} /> 추가
                    </button>
                </div>
                
                <div className="space-y-2">
                    {users.map(user => (
                        <div 
                            key={user.id} 
                            onClick={() => handleEdit(user)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between group ${
                                editingId === user.id 
                                ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700' 
                                : 'bg-white border-slate-200 hover:border-blue-200 dark:bg-slate-700/50 dark:border-slate-600 dark:hover:border-slate-500'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                    user.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300' 
                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
                                }`}>
                                    {user.name[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{user.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        ID: {user.id} 
                                        {user.role === 'admin' && <span className="text-purple-500 font-bold text-[10px] bg-purple-50 dark:bg-purple-900/20 px-1 rounded">ADMIN</span>}
                                        {user.id === currentUser.id && <span className="text-blue-500 font-bold text-[10px] bg-blue-50 dark:bg-blue-900/20 px-1 rounded">ME</span>}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleEdit(user); }}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                    title="수정"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteRequest(user.id); }}
                                    className={`p-1.5 rounded transition-colors ${
                                        user.id === currentUser.id 
                                        ? 'text-slate-200 cursor-not-allowed' 
                                        : 'text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    }`}
                                    title={user.id === currentUser.id ? "본인 삭제 불가" : "삭제"}
                                    disabled={user.id === currentUser.id}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Section */}
            <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-900 p-6 flex flex-col justify-center">
                {(isAdding || editingId) ? (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm mb-2 text-blue-600 dark:text-blue-400">
                                {isAdding ? <UserPlus size={24} /> : <UserIcon size={24} />}
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                                {isAdding ? '새 사용자 추가' : '정보 수정'}
                            </h3>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">아이디 (ID)</label>
                            <div className="relative">
                                {(!isAdding) && <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />}
                                <input 
                                    type="text" 
                                    required
                                    disabled={!isAdding}
                                    value={formData.id}
                                    onChange={e => setFormData({...formData, id: e.target.value})}
                                    className={`w-full py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:text-white ${!isAdding ? 'pl-9 bg-slate-200 dark:bg-slate-800 text-slate-500' : 'px-3 dark:bg-slate-700'}`}
                                    placeholder="로그인 ID"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">이름 (표시명)</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                                placeholder="사용자 이름"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">비밀번호</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input 
                                    type="text" 
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                    className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white font-mono focus:ring-2 focus:ring-blue-500"
                                    placeholder="비밀번호"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">권한 (Role)</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, role: 'user'})}
                                    className={`flex-1 py-2 text-sm rounded-lg border transition-all ${formData.role === 'user' ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-300 shadow-sm' : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50'}`}
                                >
                                    일반
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, role: 'admin'})}
                                    className={`flex-1 py-2 text-sm rounded-lg border transition-all ${formData.role === 'admin' ? 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/40 dark:border-purple-800 dark:text-purple-300 shadow-sm' : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50'}`}
                                >
                                    관리자
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-2">
                            <button 
                                type="button" 
                                onClick={resetForm}
                                className="flex-1 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                취소
                            </button>
                            <button 
                                type="submit" 
                                className="flex-[2] py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Save size={16} /> 저장
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <UserIcon size={48} className="mb-4 text-slate-300 dark:text-slate-700" />
                        <p className="text-sm text-center">
                            좌측 목록에서 사용자를 선택하여 수정하거나<br/>
                            <span className="font-bold text-blue-500">[+ 추가]</span> 버튼을 눌러주세요.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmationModal
          title="사용자 삭제 확인"
          message={`선택한 사용자('${showDeleteConfirm}')를 영구적으로 삭제하시겠습니까?`}
          confirmLabel="삭제"
          isDangerous={true}
          onConfirm={executeDelete}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

export default UserManagerModal;