import React from 'react';
import { BookOpen, LayoutDashboard, Warehouse, PieChart, Users } from 'lucide-react';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string;
    h2Style: string;
    pStyle: string;
}

const OverviewManual: React.FC<ManualSectionProps> = ({
    pageStyle,
    headerStyle,
    h1Style,
    h2Style,
    pStyle,
}) => {
    const featureList = [
        {
            icon: <LayoutDashboard size={24} className="text-indigo-500" />,
            title: '대시보드',
            description: '실시간 재고 현황, 입/출고 추이 등 핵심 지표를 한눈에 파악할 수 있는 종합 현황판입니다.'
        },
        {
            icon: <Warehouse size={24} className="text-teal-500" />,
            title: '재고 관리',
            description: '품목별 재고 조회, 신규 품목 등록, 정보 수정 등 재고 데이터를 체계적으로 관리합니다.'
        },
        {
            icon: <PieChart size={24} className="text-amber-500" />,
            title: '재고 분석',
            description: '기간별/품목별 입/출고량, 재고 회전율 등 심층적인 데이터 분석을 통해 재고 최적화를 지원합니다.'
        },
        {
            icon: <Users size={24} className="text-rose-500" />,
            title: '사용자 관리',
            description: '시스템 접근 권한 및 사용자 프로필을 관리하여 보안을 강화하고 역할을 분담합니다.'
        }
    ];

    return (
        <div className={pageStyle}>
            <header className={headerStyle}>
                <h1 className={h1Style}>사용자 매뉴얼</h1>
                <p className="text-xs text-slate-400">페이지 2</p>
            </header>
            <section>
                <h2 className={h2Style}><BookOpen size={20}/> 2. 주요 기능 소개</h2>
                <p className={pStyle}>
                    AI 기반 재고 관리 솔루션은 재고의 흐름을 효율적으로 추적하고, 데이터 기반의 의사결정을 지원하기 위한 다양한 기능을 제공합니다. 각 기능은 사용자가 쉽고 직관적으로 접근할 수 있도록 설계되었습니다.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {featureList.map(feature => (
                        <div key={feature.title} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-2">
                                {feature.icon}
                                <h3 className="font-bold text-md text-slate-800 dark:text-slate-100">{feature.title}</h3>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300">{feature.description}</p>
                        </div>
                    ))}
                </div>
                 <p className={`${pStyle} mt-4`}>
                    이 외에도 데이터 일괄 등록, 수불부 관리, 시스템 설정 등 재고 관리에 필요한 모든 과정을 지원하는 강력한 기능들이 포함되어 있습니다. 다음 페이지부터 각 기능에 대한 상세한 사용법을 안내합니다.
                </p>
            </section>
        </div>
    );
}

export default OverviewManual;
