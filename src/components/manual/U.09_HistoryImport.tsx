import React from 'react';
import HistoryImportUI from './ui/HistoryImportUI';
import HistoryEditModal from './ui/HistoryEditModal';
import { BookOpen } from 'lucide-react';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string;
    h2Style: string;
    pStyle: string;
    mockupContainerStyle: string;
}

const HistoryImportManual: React.FC<ManualSectionProps> = ({
    pageStyle,
    headerStyle,
    h1Style,
    h2Style,
    pStyle,
    mockupContainerStyle,
}) => {
    // For static manual purposes, we show the modal by default.
    const showEditModal = true; 

    return (
        <div className={pageStyle}>
            <header className={headerStyle}>
                <h1 className={h1Style}>사용자 매뉴얼 (계속)</h1>
                <p className="text-xs text-slate-400">페이지 6</p>
            </header>
            <section>
                <h2 className={h2Style}><BookOpen size={20}/> 7. 수불부: 모든 재고 변동 내역 추적</h2>
                <p className={pStyle}>
                    수불부는 모든 품목의 입고 및 출고 내역을 시간 순서대로 기록한 원장입니다. 이 페이지에서는 작업일자, 유형(입고/출고), 품명, 변동량, 최종 재고, 그리고 담당자 정보를 상세히 확인할 수 있습니다. 기간, 유형, 품명 등 다양한 조건으로 내역을 검색하고 필터링할 수 있어 재고의 흐름을 정확하게 추적하고 관리할 수 있습니다.
                </p>
                <div className={`${mockupContainerStyle} relative`}>
                    <p className="text-[10px] text-slate-400 mb-1 font-bold">[화면 예시] 수불부 내역 및 수정</p>
                    <HistoryImportUI />

                    {/* The modal is shown on top of the list UI for demonstration */}
                    {showEditModal && <HistoryEditModal item={null} onClose={() => {}} />}
                </div>
                 <p className={`${pStyle} mt-4`}>
                    <b>신규 등록 및 수정:</b> &apos;입/출고 등록&apos; 버튼으로 새로운 내역을 추가하거나, 각 내역의 관리 탭을 통해 기존 정보를 수정할 수 있습니다. 위 예시는 출고 내역(TR002)을 수정하는 화면입니다.
                </p>
            </section>
        </div>
    );
}

export default HistoryImportManual;
