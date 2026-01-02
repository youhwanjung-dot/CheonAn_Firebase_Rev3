
import React from 'react';
import { BookOpen, Info, HardDrive, MonitorSmartphone, DownloadCloud, Archive, Users, DatabaseBackup } from 'lucide-react';
import { APP_VERSION } from '../../constants';

interface InstallManualProps {
  pageStyle: string;
  headerStyle: string;
  h1Style: string;
  h2Style: string;
  pStyle: string;
  mockupContainerStyle: string;
  mockupWindowStyle: string;
}

const InstallManual: React.FC<InstallManualProps> = ({
  pageStyle,
  headerStyle,
  h1Style,
  h2Style,
  pStyle,
  mockupContainerStyle,
  mockupWindowStyle,
}) => {
  return (
    <>
      <div className={pageStyle}>
        <header className={headerStyle}>
          <div>
            <h1 className="text-2xl font-bold text-indigo-700">시스템 설치 및 운영 매뉴얼</h1>
            <p className="text-slate-500 text-sm font-medium">Target: Windows 10/11 Local Environment (Ver {APP_VERSION})</p>
          </div>
          <div className="text-right">
            <BookOpen size={32} className="text-indigo-600 mb-2 ml-auto" />
            <p className="text-xs text-slate-400">마지막 업데이트: {new Date().toLocaleDateString()}</p>
          </div>
        </header>
        <section>
          <h2 className={h2Style.replace('blue', 'indigo')}><Info size={20}/> 1. 설치 개요 및 환경 요구사항</h2>
          <p className={pStyle}>
            본 문서는 천안수질재고 관리 시스템을 내부망 서버 PC에 설치하고 운영하는 방법을 안내합니다. 시스템은 한 대의 PC를 서버로 사용하여, 네트워크에 연결된 여러 사용자가 웹 브라우저를 통해 동시 접속하는 방식으로 동작합니다.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="bg-slate-50 p-3 rounded-lg border">
              <h4 className="font-semibold text-slate-800 flex items-center"><HardDrive size={16} className="mr-2" /> 서버 PC (필수)</h4>
              <ul className="mt-2 list-disc list-inside text-slate-600 space-y-1">
                <li>Windows 10 또는 Windows 11 운영체제</li>
                <li>24시간 안정적으로 전원이 공급되는 환경</li>
                <li>내부 네트워크에 유선 또는 무선으로 연결</li>
              </ul>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border">
              <h4 className="font-semibold text-slate-800 flex items-center"><MonitorSmartphone size={16} className="mr-2" /> 클라이언트 PC</h4>
              <ul className="mt-2 list-disc list-inside text-slate-600 space-y-1">
                <li>운영체제 무관, 최신 웹 브라우저 (Chrome 권장)</li>
                <li>내부 네트워크에 연결</li>
              </ul>
            </div>
          </div>
        </section>
        <section>
          <h2 className={h2Style.replace('blue', 'indigo')}><DownloadCloud size={20}/> 2. 필수 소프트웨어 설치 (최초 1회)</h2>
          <p className={pStyle}>
            서버 PC에서 Node.js를 설치해야 합니다. Node.js는 서버 프로그램을 실행하기 위한 필수 환경입니다.
          </p>
          <div className="border rounded-lg bg-white shadow-sm p-4">
              <p className="mb-2">1. 웹 브라우저에서 <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="text-blue-600 underline">nodejs.org</a> 에 접속합니다.</p>
              <p>2. &apos;LTS&apos; (Long Term Support) 버전을 다운로드하여 설치합니다. 설치 시 별도 옵션 변경 없이 &apos;Next&apos;만 클릭하여 완료합니다.</p>
              <div className={mockupContainerStyle}>
                <p className="text-[10px] text-slate-400 mb-1 font-bold">[화면 예시] Node.js 공식 웹사이트</p>
                <div className={mockupWindowStyle} style={{maxWidth: '400px', margin: 'auto'}}>
                   <div className="bg-white p-4 rounded-md shadow-inner flex items-center justify-around border">
                      <div className="text-center p-3 border-4 border-green-500 rounded-lg bg-gray-50">
                          <h4 className="font-bold text-gray-800">LTS Version</h4>
                          <p className="text-gray-600 text-[10px]">Recommended</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                          <h4 className="font-bold text-gray-800">Current Version</h4>
                          <p className="text-gray-600 text-[10px]">Latest Features</p>
                      </div>
                  </div>
                </div>
              </div>
          </div>
        </section>
      </div>

      <div className={pageStyle}>
        <header className={headerStyle}>
            <h1 className={h1Style}>설치 매뉴얼 (계속)</h1>
            <p className="text-xs text-slate-400">페이지 2</p>
        </header>
        <section>
          <h2 className={h2Style.replace('blue', 'indigo')}><Archive size={20}/> 3. 시스템 설치</h2>
          <ol className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <li>
              <strong className="text-indigo-700">Step 1: 소스코드 압축 해제</strong><br/>
              개발팀으로부터 전달받은 <code>CheonInventory_v{APP_VERSION}.zip</code> 압축 파일을 서버 PC의 원하는 위치(예: <code>C:\</code>)에 압축을 해제합니다. (폴더 경로 예: <code>C:\CheonInventory</code>)
            </li>
            <li>
              <strong className="text-indigo-700">Step 2: 서버 환경 설정 (최초 1회)</strong><br/>
              압축 해제한 폴더 내의 <code>setup.bat</code> 파일을 **더블 클릭하여 실행**합니다. 검은색 명령 프롬프트 창이 나타나 서버 실행에 필요한 모든 패키지를 자동으로 설치합니다.
            </li>
            <li>
              <strong className="text-indigo-700">Step 3: 서버 시작</strong><br/>
              설치가 완료되면, <code>start.bat</code> 파일을 **더블 클릭하여 서버를 시작**합니다. &apos;Server is running...&apos; 메시지가 포함된 검은색 창이 나타나면 정상적으로 실행된 것입니다. <strong className="text-red-600">이 창은 서버이므로 종료하면 안 됩니다.</strong>
            </li>
          </ol>
          <div className={mockupContainerStyle}>
            <p className="text-[10px] text-slate-400 mb-1 font-bold">[화면 예시] 설치 및 실행 과정</p>
            <div className="bg-gray-800 text-white font-mono text-xs rounded-lg p-4 shadow-xl">
              <p className="text-gray-400">&gt; C:\CheonInventory&gt; <span className="text-white">setup.bat</span></p>
              <p>Installing server dependencies, please wait...</p>
              <p className="text-green-400">added 150 packages in 30s</p>
              <p>Setup complete.</p>
              <br/>
              <p className="text-gray-400">&gt; C:\CheonInventory&gt; <span className="text-white">start.bat</span></p>
              <p>Starting Cheonan Inventory System Server...</p>
              <p className="text-cyan-400">Server is running on http://localhost:3001</p>
              <p className="text-yellow-400">WebSocket server is listening on port 3001</p>
              <p className="text-gray-400 mt-2">_(This window must remain open to keep the server running)_</p>
            </div>
          </div>
        </section>
      </div>
      
      <div className={pageStyle}>
        <header className={headerStyle}>
            <h1 className={h1Style}>설치 매뉴얼 (계속)</h1>
            <p className="text-xs text-slate-400">페이지 3</p>
        </header>
        <section>
          <h2 className={h2Style.replace('blue', 'indigo')}><Users size={20}/> 4. 시스템 접속 방법</h2>
          <ol className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <li>
                <strong className="text-indigo-700">Step 1: 서버 PC의 IP 주소 확인</strong><br/>
                서버 PC에서 &apos;명령 프롬프트&apos;(cmd)를 열고 <code>ipconfig</code> 명령을 실행합니다. 출력된 &apos;IPv4 주소&apos; (예: <code>192.168.0.10</code>)를 확인합니다.
            </li>
            <li>
                <strong className="text-indigo-700">Step 2: 클라이언트 PC에서 접속</strong><br/>
                사용자(클라이언트) PC의 웹 브라우저 주소창에 <strong><code>http://서버_IP주소:3001</code></strong> (예: <code>http://192.168.0.10:3001</code>)을 입력하여 접속합니다.
            </li>
          </ol>
        </section>
        <section>
          <h2 className={h2Style.replace('blue', 'indigo')}><DatabaseBackup size={20}/> 5. 데이터 백업 및 복원 (중요)</h2>
          <p className={`${pStyle} text-red-600 bg-red-50 p-3 rounded-md font-semibold`}>모든 데이터는 서버 PC의 <code>database.json</code> 파일에 저장됩니다. 데이터 손실을 방지하기 위해 주기적으로 이 파일을 안전한 곳에 백업해야 합니다.</p>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <h4 className="font-bold mb-2">백업 방법:</h4>
                <p className="text-sm text-slate-600">
                서버 PC의 <code>C:\CheonInventory</code> 폴더에 있는 <code>database.json</code> 파일을 복사하여 USB 드라이브나 네트워크 공유 폴더 등 안전한 장소에 저장합니다.
                </p>
             </div>
             <div>
                <h4 className="font-bold mb-2">복원 방법:</h4>
                <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1">
                  <li>실행 중인 서버 창(검은색 창)을 닫아 서버를 중지합니다.</li>
                  <li>백업해 둔 <code>database.json</code> 파일을 <code>C:\CheonInventory</code> 폴더에 덮어씁니다.</li>
                  <li><code>start.bat</code> 파일을 다시 더블 클릭하여 서버를 시작합니다.</li>
                </ol>
             </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default InstallManual;
