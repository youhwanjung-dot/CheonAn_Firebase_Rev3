import React from 'react';
import DashboardUI from './ui/DashboardUI';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string;
    h2Style: string;
    pStyle: string;
    mockupContainerStyle: string;
}

const DashboardManual: React.FC<ManualSectionProps> = ({
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
                <p className="text-xs text-slate-400">페이지 2</p>
            </header>
            <section>
                <h2 className={h2Style}>3. 대시보드: 실시간 재고 현황 요약</h2>
                <p className={pStyle}>
                    로그인 후 가장 먼저 보게 되는 화면입니다. 대시보드에서는 전체 품목 수, 금일 입고 및 출고량, 안전 재고 도달 품목 등 핵심적인 재고 정보를 한눈에 파악할 수 있습니다. 또한, 주요 공지사항과 품목별 재고 상태를 시각적으로 확인할 수 있습니다.
                </p>
                <div className={mockupContainerStyle}>
                     <p className="text-[10px] text-slate-400 mb-1 font-bold">[화면 예시] 대시보드</p>
                    <DashboardUI />
                </div>
            </section>
        </div>
    );
}

export default DashboardManual;
