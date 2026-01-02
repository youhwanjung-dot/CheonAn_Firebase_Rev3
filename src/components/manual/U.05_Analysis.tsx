import React from 'react';
import AnalysisUI from './ui/AnalysisUI';
import { BarChart2 } from 'lucide-react';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string;
    h2Style: string;
    pStyle: string;
    mockupContainerStyle: string;
}

const AnalysisManual: React.FC<ManualSectionProps> = ({
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
                <p className="text-xs text-slate-400">페이지 4</p>
            </header>
            <section>
                <h2 className={h2Style}><BarChart2 size={20}/> 5. 재고 분석: 데이터 기반 인사이트</h2>
                <p className={pStyle}>
                    재고 분석 페이지는 축적된 데이터를 시각화하여 보여줍니다. 월별 입/출고량 추이, 카테고리별 재고 비중, 특정 품목의 재고량 변화 추이 등을 차트로 확인할 수 있습니다. 이를 통해 향후 재고 관리 계획을 보다 효과적으로 수립할 수 있습니다.
                </p>
                <div className={mockupContainerStyle}>
                     <p className="text-[10px] text-slate-400 mb-1 font-bold">[화면 예시] 재고 분석</p>
                    <AnalysisUI />
                </div>
            </section>
        </div>
    );
}

export default AnalysisManual;
