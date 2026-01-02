import React from 'react';
import HistoryUI from './ui/HistoryUI';
import { ListCollapse } from 'lucide-react';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string;
    h2Style: string;
    pStyle: string;
    mockupContainerStyle: string;
}

const HistoryManual: React.FC<ManualSectionProps> = ({
    pageStyle,
    headerStyle,
    h1Style,
    h2Style,
    pStyle,
    mockupContainerStyle,
}) => {
    return (
        <div className={pageStyle}>
            <header className={headerStyle}>
                <h1 className={h1Style}>사용자 매뉴얼 (계속)</h1>
                <p className="text-xs text-slate-400">페이지 5</p>
            </header>
            <section>
                <h2 className={h2Style}><ListCollapse size={20}/> 5. 재고 변경 이력: 모든 내역 추적</h2>
                <p className={pStyle}>
                    재고 변경 이력 페이지에서는 모든 품목의 입고 및 출고 내역을 시간순으로 확인할 수 있습니다. 이 기능을 통해 재고의 흐름을 정확하게 추적하고, 과거 데이터를 기반으로 재고 계획을 최적화할 수 있습니다.
                </p>
                <ul className="list-disc list-inside text-sm text-slate-700 mb-3 space-y-1 pl-1">
                    <li><b>기간 설정:</b> 특정 기간을 설정하여 해당 기간의 이력만 조회할 수 있습니다.</li>
                    <li><b>상세 검색:</b> 품목명, 입/출고 유형, 작업자 이름 등 다양한 조건으로 검색하여 원하는 데이터를 빠르게 찾을 수 있습니다.</li>
                </ul>
                <div className={`${mockupContainerStyle} mt-4`}>
                     <p className="text-[10px] text-slate-400 mb-2 font-bold">[화면 예시] 재고 변경 이력 조회 및 필터링</p>
                     <HistoryUI />
                </div>
            </section>
        </div>
    );
}

export default HistoryManual;
