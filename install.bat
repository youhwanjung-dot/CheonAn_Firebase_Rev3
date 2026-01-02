@echo off
chcp 65001

REM =================================================================
REM =================================================================
REM ==                                                             ==
REM ==                [기존 스크립트 - 보존됨]                     ==
REM ==       아래 스크립트는 이전 버전입니다. 백업 목적으로 보존됩니다.       ==
REM ==                                                             ==
REM =================================================================
REM =================================================================

REM @echo off
REM REM =================================================================
REM REM  Final Application Installer Script for Windows
REM REM =================================================================
REM REM This script automates the setup and build process for the 
REM REM 'cheonan-sujil-inventory' Windows application.
REM REM It will download the source, install dependencies, and build the MSI installer.
REM REM
REM REM Ensure you have an active internet connection.
REM =================================================================
REM 
REM :: Set the repository URL
REM set REPO_URL=https://github.com/youhwanjung-dot/CheonAn_Firebase_Rev3.git
REM set CLONE_DIR=CheonAn_Firebase_Rev3
REM 
REM :: Clean up previous installations
REM if exist "%CLONE_DIR%" (
REM     echo [INFO] Removing existing project directory...
REM     rmdir /s /q "%CLONE_DIR%"
REM )
REM 
REM :: Phase 1: Download Source Code
REM echo.
REM echo =================================================================
REM echo [Phase 1/3] Downloading the latest source code from GitHub...
REM echo =================================================================
REM echo.
REM 
REM start "Downloading" cmd /c "git clone %REPO_URL% && echo. && echo [SUCCESS] Source code downloaded. Please close this window. && pause"
REM 
REM :CHECK_CLONE
REM if not exist "%CLONE_DIR%\package.json" (
REM     echo Waiting for download to complete...
REM     timeout /t 5 >nul
REM     goto :CHECK_CLONE
REM )
REM 
REM cd "%CLONE_DIR%"
REM echo.
REM echo Source code download complete.
REM echo.
REM PAUSE
REM 
REM :: Phase 2: Install Dependencies
REM echo.
REM echo =================================================================
REM echo [Phase 2/3] Installing all required project dependencies...
REM echo This will open a new window. Please wait until it finishes.
REM echo =================================================================
REM echo.
REM 
REM start "Installing Dependencies" cmd /c "npm install && echo. && echo [SUCCESS] All dependencies are installed. Please close this window. && pause"
REM 
REM :CHECK_INSTALL
REM if not exist "node_modules" (
REM     echo Waiting for dependencies to be installed...
REM     timeout /t 10 >nul
REM     goto :CHECK_INSTALL
REM )
REM 
REM echo.
REM echo Dependency installation complete.
REM echo.
REM PAUSE
REM 
REM :: Phase 3: Build the Application
REM echo.
REM echo =================================================================
REM echo [Phase 3/3] Building the final application and installer (.msi)...
REM echo This is the longest step and will open a new window.
REM echo Please be patient. Ignore any warnings unless the process stops.
REM echo =================================================================
REM echo.
REM 
REM start "Building Application" cmd /c "npm run tauri build && echo. && echo [SUCCESS] Build complete! You can find the installer in 'src-tauri/target/release/bundle/msi'. Please close this window. && pause"
REM 
REM :CHECK_BUILD
REM if not exist "src-tauri\target\release\bundle\msi" (
REM     echo Waiting for the build to complete...
REM     timeout /t 15 >nul
REM     goto :CHECK_BUILD
REM )
REM 
REM echo.
REM echo =========================================================================
REM echo      BUILD SUCCESSFUL! The application has been packaged.
REM ECHO =========================================================================
REM echo.
REM 
REM :: Final Step: Open the installer folder
REM set "MSI_PATH=%CD%\src-tauri\target\release\bundle\msi\"
REM 
REM echo The Windows installer (.msi) is located at:
REM echo %MSI_PATH%
REM echo.
REM 
REM set /p open_folder="Would you like to open this folder now? (y/n): "
REM if /i "%open_folder%"=="y" (
REM     echo Opening the folder...
REM     explorer "%MSI_PATH%"
REM )
REM 
REM echo.
REM echo Script finished.
REM pause


@echo on
echo.
echo =================================================================
echo =================================================================
echo ==                                                             ==
echo ==                   [새 스크립트 - 활성화]                      ==
echo ==        이 스크립트는 개선된 버전의 설치 스크립트입니다.         ==
echo ==                                                             ==
echo =================================================================
echo =================================================================
echo.

@echo off
chcp 65001

echo ==========================================================
echo  천안수질재고 v3.5 - 자동 설치 및 빌드 스크립트 (v2)
echo ==========================================================
echo.
set CLONE_DIR=CheonAn_Firebase_Rev3

REM 1. 이전 폴더 삭제
echo [1/7] 이전 설치 폴더(%CLONE_DIR%)를 삭제합니다...
if exist "%CLONE_DIR%" (
    rmdir /s /q "%CLONE_DIR%"
)
echo.

REM 2. GitHub에서 최신 소스 코드 클론
echo [2/7] GitHub 저장소에서 최신 소스 코드를 다운로드합니다...
git clone https://github.com/youhwanjung-dot/CheonAn_Firebase_Rev3.git
if %errorlevel% neq 0 (
    echo [오류] Git 클론에 실패했습니다. 인터넷 연결 또는 Git 설치를 확인하세요.
    pause
    exit /b
)
cd %CLONE_DIR%
echo.

REM 3. NPM 캐시 정리 (잠재적 빌드 문제 해결)
echo [3/7] NPM 캐시를 정리하여 잠재적인 오류를 방지합니다...
npm cache clean --force
echo.

REM 4. 종속성 설치
echo [4/7] 필요한 라이브러리(종속성)를 설치합니다. 시간이 걸릴 수 있습니다...
npm install
if %errorlevel% neq 0 (
    echo [오류] 라이브러리 설치(npm install)에 실패했습니다. 인터넷 연결을 확인하고 다시 시도하세요.
    pause
    exit /b
)
echo.

REM 5. 프론트엔드 빌드 (문제의 핵심 단계 분리)
echo [5/7] 프론트엔드 애플리케이션을 먼저 빌드합니다 (Vite build)...
echo 이 단계에서 멈추거나 오류가 발생하면, 프론트엔드 코드 또는 종속성에 문제가 있는 것입니다.
npm run build
if %errorlevel% neq 0 (
    echo [오류] 프론트엔드 빌드(npm run build)에 실패했습니다. 스크립트를 중단합니다.
    pause
    exit /b
)
echo 프론트엔드 빌드 완료!
echo.

REM 6. Tauri 최종 빌드
echo [6/7] 데스크톱 애플리케이션을 최종 빌드합니다 (.msi 생성)...
echo 이 과정은 몇 분 정도 소요될 수 있습니다.
npx tauri build
if %errorlevel% neq 0 (
    echo [오류] 최종 데스크톱 앱 빌드(npx tauri build)에 실패했습니다.
    pause
    exit /b
)
echo.

REM 7. 최종 결과 안내
echo [7/7] 빌드가 성공적으로 완료되었습니다!
echo.
echo ==========================================================
echo 설치 파일(.msi)이 아래 경로에 생성되었습니다:
echo %cd%\src-tauri\target\release\bundle\msi\
echo ==========================================================
echo.
pause
