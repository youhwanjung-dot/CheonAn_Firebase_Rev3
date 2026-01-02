import React from 'react';
import InstallRunningUI from './ui/InstallRunningUI';
import { PlayCircle } from 'lucide-react';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string,
    h2Style: string;
    pStyle: string;
    codeBlockStyle: string;
    mockupContainerStyle: string;
}

const RunningManual: React.FC<ManualSectionProps> = ({
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
                <h1 className={h1Style}>개발자용 설치 매뉴얼 (완료)</h1>
                <p className="text-xs text-slate-400">페이지 4</p>
            </header>
            <section>
                <h2 className={h2Style}><PlayCircle size={20}/> 4. 애플리케이션 실행</h2>
                <p className={pStyle}>
                    모든 의존성 패키지 설치가 완료되었다면, 이제 프론트엔드와 백엔드 서버를 동시에 실행하여 애플리케이션을 구동할 차례입니다. `package.json`에는 이를 위한 스크립트가 미리 정의되어 있습니다.
                </p>
                <h3 className="font-bold text-slate-700 mt-6 mb-2">4.1 개발 서버 실행</h3>
                <p className={pStyle}>
                    프로젝트의 루트 디렉토리에서 아래 명령어를 실행합니다. 이 명령어는 <a href="https://www.npmjs.com/package/concurrently" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">concurrently</a> 라이브러리를 사용하여 백엔드 API 서버(<code>npm run server</code>)와 프론트엔드 개발 서버(<code>npm run client</code>)를 동시에 시작합니다.
                </p>
                <pre className={codeBlockStyle}>
                    <code># 프론트엔드와 백엔드 서버 동시 실행</code>
                    <code>npm run dev</code>
                </pre>
                 <div className={`${mockupContainerStyle} mt-4`}>
                     <p className="text-[10px] text-slate-400 mb-1 font-bold">[그림 4-1] 서버 실행 터미널 출력</p>
                    <InstallRunningUI />
                </div>
                <h3 className="font-bold text-slate-700 mt-6 mb-2">4.2 애플리케이션 확인</h3>
                <p className={pStyle}>
                    터미널에 위와 같은 로그가 출력되고 오류가 없다면 모든 서버가 성공적으로 실행된 것입니다. 이제 웹 브라우저를 열고 프론트엔드 개발 서버의 주소(일반적으로 <code className="text-sm font-semibold bg-slate-100 px-1.5 py-0.5 rounded">http://localhost:5173</code>)로 접속하여 애플리케이션의 동작을 확인할 수 있습니다.
                </p>
                 <p className={`${pStyle} text-xs text-slate-500`}>
                    <b>참고:</b> Firebase Studio 환경에서는 별도의 명령어를 실행할 필요가 없습니다. 작업 공간이 시작될 때 &apos;.idx/dev.nix&apos; 파일의 &apos;idx.workspace.onStart&apos; 설정에 따라 &apos;npm run dev&apos; 명령이 자동으로 실행되며, 우측의 &apos;Preview&apos; 탭에서 실행된 애플리케이션을 바로 확인할 수 있습니다.
                </p>
            </section>
            
        </div>
    );
}

export default RunningManual;
