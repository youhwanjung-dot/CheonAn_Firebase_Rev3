import React from 'react';
import {
    Users,
    UserPlus,
    ShieldCheck,
    Trash2
} from 'lucide-react';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string;
    h2Style: string;
    pStyle: string;
    mockupContainerStyle: string;
    mockupWindowStyle: string;
}

const UserManagementManual: React.FC<ManualSectionProps> = ({
    pageStyle,
    headerStyle,
    h1Style,
    h2Style,
    pStyle,
    mockupContainerStyle,
    mockupWindowStyle,
}) => {
    return (
        <div className={pageStyle}>
            <header className={headerStyle}>
                <h1 className={h1Style}>사용자 매뉴얼 (끝)</h1>
                <p className="text-xs text-slate-400">페이지 8</p>
            </header>
            <section>
                <h2 className={h2Style}><Users size={20}/> 9. 사용자 관리: 접근 권한 및 보안</h2>
                <p className={pStyle}>
                    사용자 관리 페이지에서는 시스템에 접근할 수 있는 사용자를 등록하고 각 사용자의 역할을 설정할 수 있습니다. &apos;관리자&apos;와 &apos;일반 사용자&apos;로 권한을 분리하여 시스템의 중요 정보 접근을 통제하고 보안을 강화합니다.
                </p>
                <div className={mockupContainerStyle}>
                    <p className="text-[10px] text-slate-400 mb-1 font-bold">[화면 예시] 사용자 목록 및 권한 설정</p>
                    <div className={`${mockupWindowStyle} !text-[11px]`}>
                        {/* Mockup Toolbar */}
                        <div className="flex items-center justify-between bg-slate-100/80 px-4 py-2 border-b border-slate-200">
                            <h3 className="font-bold text-slate-800">사용자 관리</h3>
                            <div className="flex items-center gap-1.5 text-white bg-blue-600 px-2.5 py-1 rounded-md cursor-pointer">
                                <UserPlus size={14}/>
                                <span>사용자 추가</span>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="p-2 bg-slate-50/50">
                             <table className="w-full border-collapse">
                                <thead className="font-bold text-slate-600 bg-slate-100 text-[10px]">
                                    <tr>
                                        <td className="p-1.5 border-b">ID</td>
                                        <td className="p-1.5 border-b">이름</td>
                                        <td className="p-1.5 border-b">역할</td>
                                        <td className="p-1.5 border-b text-center">관리</td>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-800 text-[10px]">
                                    <tr className="border-b bg-white">
                                        <td className="p-1.5">admin</td>
                                        <td className="p-1.5 font-semibold">김관리</td>
                                        <td className="p-1.5">
                                            <span className="font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">관리자</span>
                                        </td>
                                        <td className="p-1.5 text-center flex justify-center gap-1 items-center">
                                            <ShieldCheck size={14} className="text-slate-500 cursor-pointer"/>
                                            <Trash2 size={14} className="text-slate-500 cursor-pointer"/>
                                        </td>
                                    </tr>
                                     <tr className="border-b bg-white">
                                        <td className="p-1.5">user01</td>
                                        <td className="p-1.5 font-semibold">박현장</td>
                                        <td className="p-1.5">
                                             <span className="text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">사용자</span>
                                        </td>
                                        <td className="p-1.5 text-center flex justify-center gap-1 items-center">
                                            <ShieldCheck size={14} className="text-slate-500 cursor-pointer"/>
                                            <Trash2 size={14} className="text-slate-500 cursor-pointer"/>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
export default UserManagementManual; 
