import React from 'react';
import {
    Database,
    Plus,
    ListTree,
    Building,
    Archive
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

const MasterDataManual: React.FC<ManualSectionProps> = ({
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
                <h1 className={h1Style}>사용자 매뉴얼 (계속)</h1>
                <p className="text-xs text-slate-400">페이지 7</p>
            </header>
            <section>
                <h2 className={h2Style}><Database size={20}/> 8. 기준정보 관리: 시스템의 기본 데이터 설정</h2>
                <p className={pStyle}>
                    기준정보는 시스템 운영의 기반이 되는 데이터입니다. 품목 카테고리, 거래처, 창고 위치 등 시스템 전반에서 사용되는 기본 정보를 관리합니다. 정확한 기준정보를 유지하는 것은 재고 관리의 정확성을 높이는 데 필수적입니다.
                </p>
                <div className={mockupContainerStyle}>
                    <p className="text-[10px] text-slate-400 mb-1 font-bold">[화면 예시] 기준정보 관리</p>
                    <div className={`${mockupWindowStyle} !text-[11px]`}>
                        {/* Mockup Toolbar */}
                        <div className="flex items-center justify-between bg-slate-100/80 px-4 py-2 border-b border-slate-200">
                            <h3 className="font-bold text-slate-800">기준정보 관리</h3>
                            <div className="flex items-center gap-1.5 text-white bg-blue-600 px-2.5 py-1 rounded-md cursor-pointer">
                                <Plus size={14}/>
                                <span>신규 추가</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50/50">
                             <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm">
                                 <div className="flex items-center gap-2 mb-2">
                                     <ListTree size={14} className="text-slate-500"/>
                                     <p className="font-bold text-slate-700">품목 카테고리</p>
                                 </div>
                                 <div className="space-y-1 text-slate-600">
                                     <p>• 응집제</p>
                                     <p>• 살균소독제</p>
                                     <p>• pH조정제</p>
                                     <p>• 기타</p>
                                 </div>
                             </div>
                             <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm">
                                 <div className="flex items-center gap-2 mb-2">
                                     <Building size={14} className="text-slate-500"/>
                                     <p className="font-bold text-slate-700">거래처</p>
                                 </div>
                                 <div className="space-y-1 text-slate-600">
                                     <p>• (주)켐솔루션</p>
                                     <p>• 아쿠아케미</p>
                                     <p>• 대한화학</p>
                                 </div>
                             </div>
                              <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm">
                                 <div className="flex items-center gap-2 mb-2">
                                     <Archive size={14} className="text-slate-500"/>
                                     <p className="font-bold text-slate-700">창고</p>
                                 </div>
                                 <div className="space-y-1 text-slate-600">
                                     <p>• A동-1층</p>
                                     <p>• B동-2층</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
export default MasterDataManual;
