# Revision History: 천안수질재고

## v3.4.2: Windows 빌드 안정화 및 아이콘 문제 해결

- **주요 성과:** `install.bat` 자동화 스크립트를 통해 Windows 환경에서 `.msi` 설치 파일을 성공적으로 빌드하는 데 성공함.
- **해결된 문제:**
    - Tauri 빌드 과정에서 `the bundle config must have a .ico icon` 오류가 발생하며 중단되는 현상을 발견함.
    - 원인이 `tauri.conf.json` 파일의 `bundle.icon` 설정에 `.ico` 파일 경로가 누락되었기 때문임을 확인함.
- **수정 사항:**
    - `tauri.conf.json` 파일의 `icon` 배열에 `icons/icon.ico`를 포함한 모든 필수 아이콘 경로를 명시적으로 추가함.
    - 수정된 `tauri.conf.json` 파일을 원격 저장소에 업로드하여, `install.bat`이 항상 올바른 설정으로 빌드를 수행하도록 보장함.
- **후속 발견:** 최종 설치된 애플리케이션 폴더에 `database.json` 파일이 포함되지 않아, 초기 데이터 로딩이 불가능한 문제를 확인함.


## v3.4.1 (2026-01-01)
- **주요 변경:** Tauri 데스크톱 애플리케이션 빌드 환경 안정화
- **상세 내용:**
    - Nix 환경 설정(`.idx/dev.nix`)에 `zlib`, `glib` 등의 시스템 라이브러리 경로를 명시적으로 추가하여 Rust 링커 오류 해결.
    - 개발 워크플로우를 '안정화된 소스 코드를 GitHub에 푸시 → 고객사 PC(Windows)에서 직접 설치 파일(.msi) 생성'으로 확정.
- **신규/변경 패키지:**
    - `@tauri-apps/cli: ^1.6.3`
    - `@tauri-apps/api: ^1.5.6`
    - `concurrently: ^9.2.1`

## v3.4 (2025-05-23)
- **문서 통합 및 최종 동기화:**
  - 프로젝트의 모든 변경 이력을 `revision_history.md`로 통합하고, 설계 문서를 `blueprint.md`로 통합하여 `firebase_backup/` 폴더에 마스터 문서를 생성함.
  - `blueprint.md`에 빌드 관련 주의사항 추가 및 전체 문서 최종 검토 및 동기화 완료.

## v3.3 (2025-05-22)
- **매뉴얼 UI 일관성 개선:**
  - `DashboardUI`, `LoginUI`, `InstallEnvironmentUI` 등 매뉴얼 목업 관련 컴포넌트들의 폰트 크기, 아이콘, 패딩을 조정하여 통일성 있는 디자인을 적용함.

## v3.2 (2025-05-21)
- **지도교수 지시사항 이행:**
  - `ManualModal.tsx`의 input 태그에 `readOnly` 속성을 추가하여 React 콘솔 경고를 해결함.
  - 사이드바의 중복 메뉴("데이터 관리")를 제거하여 UI를 간소화함 (`src/index.tsx` 수정).

## v3.1 (2025-05-20)
- **AI 기능 개발 보류:**
  - Google AI의 유료 API 정책으로 인해 `geminiService.ts`의 모든 코드를 주석 처리하고, 관련 기능을 비활성화함.

## v3.0 (2025-05-19)
- **클라이언트-서버 아키텍처 도입:**
  - 기존의 단일 React 앱 구조에서 프론트엔드(Vite)와 백엔드(Express)가 분리된 구조로 전환함.
  - 백엔드 서버는 `server/index.ts`에 구현되었으며, `database.json`을 직접 읽고 쓰는 API (`/api/data`)를 제공함.
  - WebSocket을 이용한 실시간 데이터 동기화 기능 추가.

## v2.8 (2025-05-18)
- **매뉴얼 모달 UI 개선:**
  - 사용자가 매뉴얼을 확인할 수 있는 `ManualModal.tsx` 컴포넌트와 관련 UI 목업(`DashboardUI`, `LoginUI` 등)을 추가함.

## v2.0 - v2.7 (2025-05-10 ~ 2025-05-17)
- **초기 UI 목업 및 프로토타이핑:**
  - 재고 현황, 입출고 관리, 사용자 관리 등 핵심 기능에 대한 초기 UI 화면을 React 컴포넌트로 구현.
  - `react-router-dom`을 사용한 기본적인 페이지 라우팅 설정.
  - Tailwind CSS를 이용한 스타일링 적용.

## v1.0 (2025-05-09)
- **프로젝트 초기 설정:**
  - Vite와 React, TypeScript를 사용하여 기본 프로젝트 구조를 설정함.
  - `eslint`, `prettier` 등 코드 품질 도구를 도입하고 초기 설정을 완료함.

---

## Tauri Desktop App Build Debugging Log (2025-05-24)

### Entry 1: Initial Build Failure (Tauri v1 vs v2 Mismatch)

- **Problem:** `install.bat` failed, with errors pointing to `tauri.conf.json` using incompatible v2 properties (`devPath`, `distDir`).
- **Diagnosis:** The build was likely using a globally installed Tauri v2 CLI on a v1 project.
- **Fix:** Modified `install.bat` to explicitly force the installation of Tauri v1 CLI using `npm install -D @tauri-apps/cli@1`.

### Entry 2: Cargo Build Failure (Feature Mismatch)

- **Problem:** Build progressed but failed at `cargo build` with a feature mismatch error.
- **Diagnosis:** `src-tauri/Cargo.toml` contained a `"shell-open"` feature flag, a remnant from a v2 setup, which was incompatible with the v1 configuration.
- **Fix:** Removed the `"shell-open"` feature from the `tauri` dependency in `src-tauri/Cargo.toml` and pushed the fix to GitHub.

### Entry 3: Final Packaging Failure (Missing or Corrupt Icon Source)

- **Problem:** The Rust compilation succeeded, but the icon generation step (`npx tauri icon`) failed with an error: "Can't read and decode source image".
- **Diagnosis:** The initial source image, `public/vite.svg`, was likely malformed or incompatible.
- **Fix (Final):** Modified `install.bat` to use an alternative, valid image source: `src/assets/react.svg`. This resolves the final packaging blocker. All changes have been pushed to the GitHub repository.
