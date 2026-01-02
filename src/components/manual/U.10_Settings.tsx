import React from 'react';
import SettingsUI from './ui/SettingsUI';
import { Settings } from 'lucide-react';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string;
    h2Style: string;
    pStyle: string;
    mockupContainerStyle: string;
}

const SettingsManual: React.FC<ManualSectionProps> = ({
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
                <h1 className={h1Style}>사용자 매뉴얼 (완료)</h1>
                <p className="text-xs text-slate-400">페이지 7</p>
            </header>
            <section>
                <h2 className={h2Style}><Settings size={20}/> 8. 설정: 시스템 환경 맞춤화</h2>
                <p className={pStyle}>
                   설정 페이지에서는 사용자의 프로필 정보, 알림 수신 방법, 데이터 관리 등 시스템의 전반적인 환경을 설정할 수 있습니다. 각 탭을 통해 원하는 설정 항목으로 이동하여 변경사항을 적용할 수 있습니다.
                </p>
                <div className={mockupContainerStyle}>
                     <p className="text-[10px] text-slate-400 mb-1 font-bold">[화면 예시] 설정 페이지</p>
                    <SettingsUI />
                </div>
                 <p className={`${pStyle} mt-4`}>
                    <b>프로필:</b> 사용자 이름 및 비밀번호를 변경합니다. <br />
                    <b>알림:</b> 재고 부족, 일일 보고서 등 주요 이벤트에 대한 알림 수신 여부를 설정합니다.<br />
                    <b>데이터 관리:</b> 현재까지의 모든 데이터를 백업하거나, 시스템을 초기 상태로 되돌릴 수 있습니다. 데이터 삭제는 되돌릴 수 없으므로 주의가 필요합니다.
                </p>
            </section>
        </div>
    );
}

export default SettingsManual;
