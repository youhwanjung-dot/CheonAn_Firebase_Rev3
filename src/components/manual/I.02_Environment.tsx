import React from 'react';
import InstallEnvironmentUI from './ui/InstallEnvironmentUI';
import { Wrench } from 'lucide-react';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string;
    h2Style: string;
    pStyle: string;
    codeBlockStyle: string;
    mockupContainerStyle: string;
}

const EnvironmentManual: React.FC<ManualSectionProps> = ({
    pageStyle,
    headerStyle,
    h1Style,
    h2Style,
    pStyle,
    codeBlockStyle,
    mockupContainerStyle,
}) => {
    return (
        <div className={pageStyle}>
            <header className={headerStyle}>
                <h1 className={h1Style}>개발자용 설치 매뉴얼 (계속)</h1>
                <p className="text-xs text-slate-400">페이지 2</p>
            </header>
            <section>
                <h2 className={h2Style}><Wrench size={20}/> 2. 개발 환경 준비</h2>
                <p className={pStyle}>
                    애플리케이션을 성공적으로 빌드하고 실행하기 위해서는 몇 가지 필수적인 개발 도구가 필요합니다. 아래 목록은 본 프로젝트가 의존하는 핵심 소프트웨어와 권장 버전을 나타냅니다.
                </p>
                <div className={`${mockupContainerStyle} my-4`}>
                    <p className="text-[10px] text-slate-400 mb-1 font-bold">[그림 2-1] 필수 개발 도구 목록</p>
                    <InstallEnvironmentUI />
                </div>
                <h3 className="font-bold text-slate-700 mt-6 mb-2">2.1 Node.js 및 npm</h3>
                <p className={pStyle}>
                    <b>Node.js</b>는 서버 사이드에서 JavaScript를 실행할 수 있게 해주는 런타임 환경입니다. 본 프로젝트의 백엔드 서버(Express)는 Node.js 위에서 동작하며, 프론트엔드 개발 과정(Vite, 의존성 관리 등)에서도 필수적으로 사용됩니다. <b>npm</b>(Node Package Manager)은 Node.js 설치 시 함께 제공되는 패키지 관리 도구로, 프로젝트에 필요한 모든 외부 라이브러리(의존성)를 설치하고 관리하는 역할을 합니다.
                </p>
                <p className={pStyle}>
                    터미널에서 아래 명령어를 실행하여 현재 설치된 버전을 확인할 수 있습니다. 권장 버전과 다르거나 설치되어 있지 않은 경우, 공식 웹사이트를 통해 설치를 진행해야 합니다.
                </p>
                <pre className={codeBlockStyle}>
                    <code># Node.js 버전 확인 (v20.x.x 이상 권장)</code>
                    <code>node -v</code>
                    <br />
                    <code># npm 버전 확인 (v10.x.x 이상 권장)</code>
                    <code>npm -v</code>
                </pre>
                 <p className={`${pStyle} text-xs text-slate-500`}>
                    <b>참고:</b> Firebase Studio의 웹 IDE 환경에서는 프로젝트 시작 시점에 `.idx/dev.nix` 파일에 명시된 버전에 따라 Node.js와 npm이 자동으로 설치 및 구성되므로, 사용자가 직접 설치할 필요가 없습니다.
                </p>
            </section>
        </div>
    );
}

export default EnvironmentManual;
