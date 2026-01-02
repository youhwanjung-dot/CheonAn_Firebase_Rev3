import React from 'react';
import BulkImportUI from './ui/BulkImportUI';
import BulkImportResultUI from './ui/BulkImportResultUI';
import { UploadCloud, CheckCheck } from 'lucide-react';

interface ManualSectionProps {
    pageStyle: string;
    headerStyle: string;
    h1Style: string;
    h2Style: string;
    pStyle: string;
    mockupContainerStyle: string;
}

const BulkImportManual: React.FC<ManualSectionProps> = ({
    pageStyle,
    headerStyle,
    h1Style,
    h2Style,
    pStyle,
    mockupContainerStyle,
}) => {
    return (
        <>
            {/* Page 1: File Upload & Column Mapping */}
            <div className={pageStyle}>
                <header className={headerStyle}>
                    <h1 className={h1Style}>사용자 매뉴얼</h1>
                    <p className="text-xs text-slate-400">페이지 5</p>
                </header>
                <section>
                    <h2 className={h2Style}><UploadCloud size={20}/> 5. 일괄 등록: 파일 업로드 및 컬럼 매핑</h2>
                    <p className={pStyle}>
                        엑셀(Excel) 또는 CSV 파일을 이용하여 대량의 재고 입고 내역을 한 번에 등록할 수 있습니다. 먼저 정해진 양식의 파일을 업로드한 후, 파일의 각 컬럼이 시스템의 어떤 정보에 해당하는지 &apos;컬럼 매핑&apos; 과정을 거칩니다. 이 과정을 통해 다양한 형식의 파일도 유연하게 처리할 수 있습니다.
                    </p>
                    <div className={mockupContainerStyle}>
                        <p className="text-[10px] text-slate-400 mb-2 font-bold">[화면 예시] 파일 업로드 및 컬럼 매핑</p>
                        <BulkImportUI />
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                        <span className="font-bold">Tip:</span> &apos;양식 다운로드&apos; 버튼을 클릭하여 정확한 데이터 형식의 템플릿 파일을 받을 수 있습니다. 템플릿을 사용하면 데이터 오류를 최소화할 수 있습니다.
                    </div>
                </section>
            </div>

            {/* Page 2: Validation Result */}
            <div className={pageStyle}>
                <header className={headerStyle}>
                    <h1 className={h1Style}>사용자 매뉴얼 (계속)</h1>
                    <p className="text-xs text-slate-400">페이지 6</p>
                </header>
                <section>
                    <h2 className={h2Style}><CheckCheck size={20}/> 5. 일괄 등록: 유효성 검사 및 최종 등록</h2>
                    <p className={pStyle}>
                        &apos;유효성 검사&apos;를 클릭하면 시스템이 데이터의 정합성을 확인합니다. 검사 완료 후에는 아래와 같이 성공, 실패, 또는 수정이 필요한 항목을 상세히 보여주는 결과 화면이 나타납니다.
                    </p>
                    <ul className="list-disc list-inside text-sm text-slate-700 mb-3 space-y-1 pl-1">
                        <li><strong className="text-green-600">성공:</strong> 즉시 등록 가능한 데이터입니다.</li>
                        <li><strong className="text-amber-600">수정 필요:</strong> 내용을 직접 수정하고 저장하거나, 원본 파일에서 수정 후 다시 업로드할 수 있습니다.</li>
                        <li><strong className="text-red-600">실패:</strong> 등록이 불가능한 데이터로, 행을 삭제하거나 원본 파일에서 수정해야 합니다.</li>
                    </ul>
                    <p className={pStyle}>
                        검토가 완료되면 &apos;성공 건만 등록&apos; 버튼을 눌러 유효한 데이터만 시스템에 반영할 수 있습니다.
                    </p>
                    <div className={`${mockupContainerStyle} mt-4`}>
                        <p className="text-[10px] text-slate-400 mb-2 font-bold">[화면 예시] 유효성 검사 결과</p>
                        <BulkImportResultUI />
                    </div>
                </section>
            </div>
        </>
    );
}

export default BulkImportManual;
