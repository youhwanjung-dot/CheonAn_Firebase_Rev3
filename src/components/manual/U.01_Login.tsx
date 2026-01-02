import React from 'react';
import LoginUI from './ui/LoginUI';
import { KeyRound, ShieldCheck } from 'lucide-react';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string;
    h2Style: string;
    pStyle: string;
    mockupContainerStyle: string;
}

const LoginManual: React.FC<ManualSectionProps> = ({
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
                <h1 className={h1Style}>사용자 매뉴얼</h1>
                <p className="text-xs text-slate-400">페이지 1</p>
            </header>
            <section>
                <h2 className={h2Style}><KeyRound size={20}/> 1. 시스템 접속 및 로그인</h2>
                <p className={pStyle}>
                    재고 관리 시스템을 사용하기 위해 먼저 로그인을 해야 합니다. 시스템에 접속하면 아래와 같은 로그인 화면이 나타납니다. 관리자로부터 발급받은 아이디(이메일)와 비밀번호를 정확히 입력하세요.
                </p>
                
                <div className={`${mockupContainerStyle} mt-4 flex justify-center`}>
                   <div className="w-full max-w-md">
                     <p className="text-[10px] text-slate-400 mb-2 font-bold text-center">[화면 예시] 시스템 로그인</p>
                     <LoginUI />
                   </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-slate-50 border rounded-lg">
                        <h4 className="font-bold text-slate-700">아이디 및 비밀번호</h4>
                        <p className="text-xs text-slate-600 mt-1">- 아이디는 가입 시 등록한 이메일 주소입니다.<br/>- 보안을 위해 비밀번호는 주기적으로 변경하는 것을 권장합니다.</p>
                    </div>
                    <div className="p-3 bg-slate-50 border rounded-lg">
                        <h4 className="font-bold text-slate-700">로그인 옵션</h4>
                        <p className="text-xs text-slate-600 mt-1">- <b>아이디 저장:</b> 체크하면 다음 접속 시 아이디가 자동으로 입력됩니다.<br/>- <b>비밀번호 찾기:</b> 비밀번호를 잊으셨을 경우, 이 링크를 통해 재설정할 수 있습니다.</p>
                    </div>
                </div>
                 <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800">
                    <div className="flex items-start">
                        <ShieldCheck size={20} className="mr-3 flex-shrink-0 mt-0.5"/>
                        <div>
                            <h5 className="font-bold">보안 안내</h5>
                            <p className="text-xs">개인정보 보호를 위해 공용 PC에서는 &apos;아이디 저장&apos; 기능 사용을 자제하고, 사용 후에는 반드시 로그아웃해주시기 바랍니다.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LoginManual;
