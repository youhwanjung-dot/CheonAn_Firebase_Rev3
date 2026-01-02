import React from 'react';
import InventoryUI from './ui/InventoryUI';
import InventoryNewModal from './ui/InventoryNewModal';
import InventoryEditModal from './ui/InventoryEditModal';
import TransactionModalUI from './ui/TransactionModalUI';
import { Database, PlusCircle, Edit, ArrowRightLeft } from 'lucide-react';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string;
    h2Style: string;
    pStyle: string;
    mockupContainerStyle: string;
}

const InventoryManual: React.FC<ManualSectionProps> = ({
    pageStyle,
    headerStyle,
    h1Style,
    h2Style,
    pStyle,
    mockupContainerStyle,
}) => {

    return (
        <>
            {/* Page 1: Inventory List & Item Management */}
            <div className={pageStyle}>
                <header className={headerStyle}>
                    <h1 className={h1Style}>사용자 매뉴얼</h1>
                    <p className="text-xs text-slate-400">페이지 3</p>
                </header>
                <section>
                    <h2 className={h2Style}><Database size={20}/> 3. 재고 현황: 품목 관리</h2>
                    <p className={pStyle}>
                        재고 현황 페이지에서는 시스템에 등록된 모든 품목의 현재고, 안전재고 등 상세 정보를 표 형태로 확인합니다. 검색과 필터 기능을 통해 원하는 품목을 쉽게 찾을 수 있으며, 신규 품목을 등록하거나 기존 정보를 수정/삭제할 수 있습니다.
                    </p>
                    
                    <div className={`${mockupContainerStyle} mt-2`}>
                        <p className="text-[10px] text-slate-400 mb-2 font-bold">[화면 예시] 재고 현황 목록</p>
                        <InventoryUI />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2"><PlusCircle size={16}/> 신규 품목 등록</h3>
                            <p className={`${pStyle} text-xs !mb-2`}>&apos;신규 품목 등록&apos; 버튼으로 새 품목의 정보를 입력합니다.</p>
                            <div className={`${mockupContainerStyle} relative`}>
                                <InventoryNewModal onClose={() => {}} />
                            </div>
                        </div>
                         <div>
                            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2"><Edit size={16}/> 품목 정보 수정</h3>
                            <p className={`${pStyle} text-xs !mb-2`}>수정 아이콘을 클릭하여 기존 품목 정보를 변경합니다.</p>
                            <div className={`${mockupContainerStyle} relative`}>
                                <InventoryEditModal item={undefined} onClose={() => {}} />
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Page 2: Stock Transaction */}
             <div className={pageStyle}>
                <header className={headerStyle}>
                    <h1 className={h1Style}>사용자 매뉴얼 (계속)</h1>
                    <p className="text-xs text-slate-400">페이지 4</p>
                </header>
                <section>
                    <h2 className={h2Style}><ArrowRightLeft size={20}/> 4. 재고 현황: 재고 변경 등록</h2>
                    <p className={pStyle}>
                        각 품목의 &apos;입고&apos; 또는 &apos;출고&apos; 버튼을 클릭하여 재고 변경 내역을 등록할 수 있습니다. 재고 변경은 입고(구매/생산)와 출고(사용) 두 가지 유형으로 나뉩니다. 작업일자, 수량, 작업자, 비고 등을 상세히 기록하여 정확한 재고 추적을 보장합니다.
                    </p>
                    
                    <div className={`${mockupContainerStyle} mt-4`}>
                        <p className="text-[10px] text-slate-400 mb-2 font-bold">[화면 예시] 재고 변경 등록 모달</p>
                        <TransactionModalUI />
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li><b>입고/출고 선택:</b> 상단의 버튼을 눌러 재고 변경 유형을 선택합니다.</li>
                            <li><b>수량 입력:</b> 변경된 재고의 수량을 정확히 입력합니다.</li>
                            <li><b>정보 기록:</b> 작업자, 담당자, 비고 등을 기록하여 이력 관리의 정확성을 높일 수 있습니다.</li>
                            <li><b>최종 등록:</b> &apos;입고 등록&apos; 또는 &apos;출고 등록&apos; 버튼을 클릭하여 변경 사항을 시스템에 최종 반영합니다.</li>
                        </ul>
                    </div>
                </section>
            </div>
        </>
    );
}

export default InventoryManual;
