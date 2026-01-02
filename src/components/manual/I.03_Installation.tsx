import React from 'react';
import InstallDependenciesUI from './ui/InstallDependenciesUI';
import { Download } from 'lucide-react';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string;
    h2Style: string;
    pStyle: string;
    codeBlockStyle: string;
    mockupContainerStyle: string;
}

const InstallationManual: React.FC<ManualSectionProps> = ({
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
                <p className="text-xs text-slate-400">페이지 3</p>
            </header>
            <section>
                <h2 className={h2Style}><Download size={20}/> 3. 소스 코드 및 의존성 설치</h2>
                <p className={pStyle}>
                    개발 환경이 준비되었다면, 다음 단계는 원격 저장소에서 프로젝트의 소스 코드를 로컬 환경으로 복제(Clone)하고, 애플리케이션 실행에 필요한 모든 의존성 패키지를 설치하는 것입니다.
                </p>
                
                <h3 className="font-bold text-slate-700 mt-6 mb-2">3.1 소스 코드 복제 (Clone)</h3>
                 <p className={pStyle}>
                    Git을 사용하여 아래 명령어를 터미널에서 실행합니다. 현재 디렉토리 하위에 프로젝트 폴더가 생성되고 소스 코드가 다운로드됩니다.
                </p>
                <pre className={codeBlockStyle}>
                    <code># HTTPS 방식</code>
                    <code>git clone https://github.com/your-username/your-repository.git</code>
                    <br />
                    <code># 생성된 프로젝트 폴더로 이동</code>
                    <code>cd your-repository</code>
                </pre>
                <p className={`${pStyle} text-xs text-slate-500`}>
                    <b>참고:</b> Firebase Studio 환경에서는 이미 소с 코드가 작업 공간에 로드되어 있으므로, 별도의 `git clone` 과정은 필요하지 않습니다.
                </p>

                <h3 className="font-bold text-slate-700 mt-6 mb-2">3.2 의존성 패키지 설치</h3>
                <p className={pStyle}>
                    프로젝트 루트 디렉토리에는 `package.json` 파일이 존재하며, 여기에는 프로젝트 실행과 개발에 필요한 모든 라이브러리(의존성) 목록이 정의되어 있습니다. 아래 명령어를 실행하면 npm이 이 파일을 읽어 해당 라이브러리들을 `node_modules` 폴더에 자동으로 설치합니다.
                </p>
                <div className={`${mockupContainerStyle} mt-4`}>
                     <p className="text-[10px] text-slate-400 mb-1 font-bold">[그림 3-1] 의존성 패키지 목록 및 설치 과정</p>
                    <InstallDependenciesUI />
                </div>
            </section>
        </div>
    );
}

export default InstallationManual;
