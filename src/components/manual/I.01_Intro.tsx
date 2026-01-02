import React from 'react';
import InstallIntroUI from './ui/InstallIntroUI';
import { Layers } from 'lucide-react';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string;
    h2Style: string;
    pStyle: string;
    mockupContainerStyle: string;
}

const IntroManual: React.FC<ManualSectionProps> = ({
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
                <h1 className={h1Style}>개발자용 설치 매뉴얼</h1>
                <p className="text-xs text-slate-400">페이지 1</p>
            </header>
            <section>
                <h2 className={h2Style}><Layers size={20}/> 1. 시스템 개요 및 아키텍처</h2>
                <p className={pStyle}>
                    본 문서는 &apos;AI 기반 재고 관리 솔루션&apos;의 개발 환경을 설정하고, 시스템을 로컬 환경에 설치 및 실행하는 과정을 안내합니다. 본 시스템은 독립 실행형(Standalone) 웹 애플리케이션으로, 프론트엔드와 백엔드가 분리된 클라이언트-서버 아키텍처를 기반으로 합니다.
                </p>
                <div className={`${mockupContainerStyle} my-4`}>
                     <p className="text-[10px] text-slate-400 mb-1 font-bold">[그림 1-1] 시스템 아키텍처 다이어그램</p>
                    <InstallIntroUI />
                </div>
                <p className={pStyle}>
                    <b>프론트엔드</b>는 사용자가 직접 상호작용하는 웹 인터페이스로, <span className="font-semibold text-sky-600">React</span>와 <span className="font-semibold text-purple-600">Vite</span>를 사용하여 구축되었습니다. 모든 UI 컴포넌트와 비즈니스 로직은 TypeScript와 JSX 문법으로 작성됩니다.
                </p>
                <p className={pStyle}>
                    <b>백엔드</b>는 데이터 처리와 비즈니스 로직을 담당하는 API 서버로, <span className="font-semibold text-green-600">Node.js</span> 환경에서 <span className="font-semibold text-slate-700">Express</span> 프레임워크를 기반으로 동작합니다. 데이터는 별도의 데이터베이스 서버 없이, 파일 시스템에 <span className="font-semibold text-orange-500">JSON</span> 형식으로 저장하여 관리의 복잡성을 최소화했습니다.
                </p>
                 <p className={pStyle}>
                    개발 환경에서는 Vite의 내장 프록시 기능을 사용하여 프론트엔드에서 발생하는 API 요청을 백엔드 서버로 안전하게 전달합니다. 이를 통해 CORS(Cross-Origin Resource Sharing) 정책을 우회하고 원활한 데이터 통신을 보장합니다.
                </p>
            </section>
        </div>
    );
}

export default IntroManual;
