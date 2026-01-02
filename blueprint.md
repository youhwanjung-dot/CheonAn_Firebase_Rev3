# Blueprint: 천안수질재고 v3.5

## 1. 개요 (Overview)

본 문서는 '천안수질재고' React 애플리케이션의 개발 계획, 기술 가이드라인, 그리고 주요 지시사항을 포함하는 마스터 설계 문서입니다. 프로젝트의 일관성을 유지하고, 협업을 원활하게 하며, 안정적인 운영을 목표로 합니다.

## 2. 지도교수 지시사항 및 예정 작업 (Directives & Roadmap)

### 현 버전 (v3.5) 주요 가이드라인

- **Tauri 데스크톱 앱 빌드:**
  - **지시사항:** 기존 React 웹 애플리케이션을 Tauri v1을 사용하여 안정적인 Windows 데스크톱 애플리케이션으로 패키징합니다. 빌드 자동화 스크립트(`install.bat`)의 완결성을 확보해야 합니다.

- **UI 일관성 유지:**
  - **지시사항:** 매뉴얼 및 대시보드 등 모든 UI 컴포넌트의 글자 크기, 레이아웃, 디자인 스타일을 통일하여 사용자 경험(UX)의 일관성을 확보해야 합니다.

- **코드 품질 관리:**
  - **지시사항:** `eslint`와 TypeScript를 적극적으로 활용하여 코드의 안정성과 가독성을 높여야 합니다. 특히 `any` 타입의 무분별한 사용을 지양해야 합니다.

## 3. 개발 및 운영 가이드라인 (Dev & Ops Guideline)

### 3.1. 핵심 원칙: 단일 진실 공급원 (Single Source of Truth)

- **파일 수정 원칙:** 모든 수정 작업은 프로젝트 루트 디렉토리에 있는 **원본 파일**을 대상으로 하는 것을 원칙으로 합니다.
- **중복 및 임시 파일 금지:** 디버깅이나 테스트 목적으로 특정 파일을 복사하여 임시 파일을 만드는 것을 **엄격히 금지**합니다. 예를 들어, `App_copy.tsx`나 `temp_database.json`과 같은 파일은 프로젝트의 일관성을 해치고 혼란을 야기하므로 절대 생성해서는 안 됩니다.
- **지속적인 정리:** 불필요하다고 판단되는 임시 파일, 중복 파일, 테스트용 스크립트 등은 발견 즉시 삭제하여 항상 프로젝트를 깨끗한 상태로 유지합니다.

### 3.2. Eslint 및 빌드 주의사항

- **오류 유형 1: `TS6133: '...' is declared but its value is never read.`**
    - **원인:** 사용하지 않는 변수나 import 구문이 있을 때 발생합니다.
    - **해결책:** 불필요한 변수나 import 구문을 삭제하거나 주석 처리합니다.

- **오류 유형 2: `@typescript-eslint/no-explicit-any`**
    - **원인:** `any` 타입의 사용을 금지하는 `eslint` 규칙 때문에 발생합니다.
    - **해결책:** 데이터 구조에 맞는 구체적인 `interface`나 `type`을 정의하여 사용합니다.

### 3.3. 백업 및 롤백 절차

- **백업 생성:** 주요 변경 완료 후, `rsync -av --progress --exclude 'node_modules' --exclude '.git' --exclude 'dist' . firebase_backup/rev_X.X/` 명령어를 사용합니다.
- **롤백:** 문제가 발생하면 해당 버전의 백업 폴더 내용을 프로젝트 루트로 덮어쓰기합니다.

### 3.4. 배포 및 설치 프로세스 원칙 (Deployment & Installation Principle)

- **개발 환경 (Firebase Studio):**
    - **역할:** 데스크톱 애플리케이션의 빌드가 기술적으로 성공하는지 **테스트하고 검증**하는 역할만 수행합니다.
    - **환경:** Linux 기반이므로, 빌드 과정에서 발생하는 Linux 플랫폼 관련 아이콘 생성 오류 등은 최종 결과물에 영향을 주지 않으므로 무시하거나 건너뜁니다. (`fix_icons.cjs`는 이러한 문제를 우회하기 위한 스크립트입니다.)

- **배포 환경 (고객사 PC):**
    - **역할:** 최종 사용자가 사용할 **실제 설치 파일(.msi)을 생성**하는 환경입니다.
    - **프로세스:** `install.bat` 스크립트가 모든 과정을 자동화합니다. 이 스크립트는 GitHub에서 최신 소스 코드를 다운로드하고, 필요한 경우 Windows용 아이콘 문제를 해결(`fix_win_icons.cjs` 등)한 뒤, 컴파일 및 최종 설치 파일을 생성하는 모든 작업을 담당합니다.

- **저장소 초기화 및 파일 푸시 (Repository Initialization & Push):**
  - **원칙:** "포지티브 필터링(Positive Filtering)" 방식을 사용하여, 배포 및 설치에 필수적인 파일과 폴더만 명시적으로 선택하여 저장소에 추가합니다. 이는 `.gitignore`에 의존하는 "네거티브 필터링" 방식보다 안전하며, 의도치 않은 파일(예: 로컬 IDE 설정, 임시 백업)이 저장소에 포함되는 것을 원천적으로 차단합니다.
  - **절차:**
    1.  `rm -rf .git` 명령으로 로컬 Git 설정을 완전히 제거합니다.
    2.  `git init`으로 새로운 로컬 저장소를 생성합니다.
    3.  `git remote add origin [Repository URL]` 명령으로 원격 저장소를 연결합니다.
    4.  `git add [file/folder list ...]` 명령을 사용하여, 사전에 정의된 필수 파일 및 폴더 목록만 정확히 스테이징합니다.
    5.  첫 커밋(`git commit -m "Initial commit"`)을 생성하고 원격 저장소에 푸시(`git push -u origin main`)하여 깨끗한 상태의 프로젝트를 업로드합니다.
  - **[수정] 필수 파일 스테이징 상세 지침:**
    - **`src-tauri` 처리:** `git add src-tauri` 명령으로 폴더 전체를 추가한 뒤, `git reset src-tauri/target` 명령을 사용하여 빌드 결과물인 `target` 폴더만 스테이징에서 제외합니다. 이는 `icon.png`와 같은 필수 자원은 포함시키면서, 불필요한 빌드 캐시는 제외하는 가장 정확한 방법입니다.
    - **Tauri 설정 파일:** `src-tauri/tauri.conf.json`이 반드시 포함되었는지 재차 확인해야 합니다. 이 파일 누락은 빌드 실패의 직접적인 원인이 됩니다.

## 4. 필수 패키지 및 라이브러리 버전 (Dependencies & Versions)

### 4.1. Tauri 데스크톱 앱 빌드 (Tauri Desktop App Build)

- **`@tauri-apps/cli` (npm):** `~1.5.0` (반드시 v1 CLI를 사용해야 함)
- **`tauri` (Rust Crate):** `1.6`
- **`tauri-build` (Rust Crate):** `1.5`

### 4.2. 주요 웹 라이브러리 (Key Web Libraries)

- **`react`:** `^19.2.3`
- **`vite`:** `^6.4.1`
- **`tailwindcss`:** `^3.4.1`
- **`typescript`:** `^5.4.5`
- **`eslint`:** `^8.57.0`

## 5. 최종 빌드 및 설치 계획 (Final Build & Install Plan)

1.  **사용자 준비:** 로컬 PC에서 기존 `CheonAn_Firebase_Rev3` 폴더와 `install.bat` 파일을 완전히 삭제합니다.
2.  **스크립트 실행:** GitHub 저장소에서 최신 `install.bat` 파일을 다운로드하여 실행합니다.
3.  **자동화 프로세스:** 스크립트는 다음을 자동으로 수행합니다.
    - Git 저장소 클론
    - 모든 npm 종속성 설치 (Tauri v1 CLI 포함)
    - 애플리케이션 아이콘 자동 생성
    - `npx tauri build` 명령어로 최종 빌드 및 패키징 실행
4.  **결과 확인:** `src-tauri/target/release/bundle/msi/` 경로에 생성된 `.msi` 설치 파일을 확인합니다.

## 6. 향후 계약 및 로드맵 (v4.0)

본 섹션은 v4.0에서 진행될 아키텍처 변경 계획을 명세합니다. (참고: `R1. 아키텍처 변경 상세 명세서`)

### 6.1. 핵심 변경 사항 (Core Changes)

- **데이터베이스 전환:**
  - 기존의 `database.json` 파일 시스템에서, 동시성 제어 및 트랜잭션 지원이 강화된 **SQLite (`inventory.db`)** 로 변경됩니다.
  - DB 파일은 프로젝트 폴더가 아닌, 사용자 데이터 영역(**`%APPDATA%\CheonanInventory`**)에 고정적으로 저장하여 데이터와 애플리케이션을 분리합니다.

- **서버 아키텍처 변경:**
  - `pkg`를 사용하여 Node.js 백엔드 서버를 **단일 실행 파일 (`server.exe`)**로 패키징합니다. 이를 통해 Node.js 런타임이 설치되지 않은 환경에서도 서버를 구동할 수 있습니다.
  - 프론트엔드는 `vite build`를 통해 생성된 **정적 파일(static files)** 형태로, 백엔드 Express 서버가 직접 서빙하는 구조로 변경됩니다.

- **Tauri 연동 방식 고도화:**
  - 단순 웹뷰 래퍼(Wrapper) 방식에서, **Sidecar 패턴**으로 변경됩니다.
  - Tauri 앱이 시작될 때 백엔드 서버(`server.exe`)를 자동으로 실행하고, 앱이 종료될 때 서버 프로세스도 함께 종료시켜 안정적인 라이프사이클을 관리합니다.

- **실시간 통신 역할 변경:**
  - `Socket.IO`의 역할을 데이터 직접 동기화에서, 데이터 변경이 발생했음을 클라이언트에 알리는 **단순 알림(Notification) 채널**로 축소하여 부하를 줄입니다.

### 6.2. 개발 환경 개선

- `concurrently`와 `nodemon`을 도입하여, `npm run dev` 실행 시 프론트엔드와 백엔드 개발 서버가 동시에 실행되고, 코드 변경 시 자동으로 재시작되는 효율적인 개발 환경을 구축합니다.

### 6.3. 주요 신규 라이브러리 (v4.0)

- **Backend:** `better-sqlite3`, `pkg`
- **Frontend:** `@tanstack/react-query`
- **Dev-Ops:** `concurrently`, `nodemon`
