import React from 'react';
import StatisticsUI from './ui/StatisticsUI';
import { BarChart3 } from 'lucide-react';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string;
    h2Style: string;
    pStyle: string;
    mockupContainerStyle: string;
}

const StatisticsManual: React.FC<ManualSectionProps> = ({
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
                <h2 className={h2Style}><BarChart3 size={20}/> 2. 통계 분석: 데이터 시각화</h2>
                <p className={pStyle}>
                    통계 분석 페이지에서는 재고 데이터를 기반으로 한 다양한 시각 자료를 제공합니다. 주요 지표(KPI)를 통해 현재 재고 상태를 빠르게 파악하고, 차트를 통해 월별 입/출고 추이 및 품목별 재고 구성비를 직관적으로 이해할 수 있습니다. 이는 데이터 기반의 의사결정을 돕고 재고 관리 효율을 극대화합니다.
                </p>
                <div className={`${mockupContainerStyle} mt-4`}>
                     <p className="text-[10px] text-slate-400 mb-2 font-bold">[화면 예시] 통계 분석 대시보드</p>
                     <StatisticsUI />
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-slate-50 border rounded-lg">
                        <h4 className="font-bold text-slate-700">월별 입/출고 현황</h4>
                        <p className="text-xs text-slate-600">막대 차트는 최근 몇 개월간의 입고량(파란색)과 출고량(회색)을 비교하여 보여줍니다. 이를 통해 계절적 수요 변화나 특정 이벤트의 영향을 파악할 수 있습니다.</p>
                    </div>
                    <div className="p-3 bg-slate-50 border rounded-lg">
                        <h4 className="font-bold text-slate-700">품목별 재고 구성비</h4>
                        <p className="text-xs text-slate-600">원형 차트는 현재고를 기준으로 각 품목 카테고리가 차지하는 비중을 보여줍니다. 어떤 품목이 재고의 대부분을 차지하는지 쉽게 확인할 수 있습니다.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default StatisticsManual;
