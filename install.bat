@echo off
REM =================================================================
REM  Final Application Installer Script for Windows
REM =================================================================
REM This script automates the setup and build process for the 
REM 'cheonan-sujil-inventory' Windows application.
REM It will download the source, install dependencies, and build the MSI installer.
REM
REM Ensure you have an active internet connection.
REM =================================================================

:: Set the repository URL
set REPO_URL=https://github.com/youhwanjung-dot/CheonAn_Firebase_Rev3.git
set CLONE_DIR=CheonAn_Firebase_Rev3

:: Clean up previous installations
if exist "%CLONE_DIR%" (
    echo [INFO] Removing existing project directory...
    rmdir /s /q "%CLONE_DIR%"
)

:: Phase 1: Download Source Code
echo.
echo =================================================================
echo [Phase 1/3] Downloading the latest source code from GitHub...
echo =================================================================
echo.

start "Downloading" cmd /c "git clone %REPO_URL% && echo. && echo [SUCCESS] Source code downloaded. Please close this window. && pause"

:CHECK_CLONE
if not exist "%CLONE_DIR%\package.json" (
    echo Waiting for download to complete...
    timeout /t 5 >nul
    goto :CHECK_CLONE
)

cd "%CLONE_DIR%"
echo.
echo Source code download complete.
echo.
PAUSE

:: Phase 2: Install Dependencies
echo.
echo =================================================================
echo [Phase 2/3] Installing all required project dependencies...
echo This will open a new window. Please wait until it finishes.
echo =================================================================
echo.

start "Installing Dependencies" cmd /c "npm install && echo. && echo [SUCCESS] All dependencies are installed. Please close this window. && pause"

:CHECK_INSTALL
if not exist "node_modules" (
    echo Waiting for dependencies to be installed...
    timeout /t 10 >nul
    goto :CHECK_INSTALL
)

echo.
echo Dependency installation complete.
echo.
PAUSE

:: Phase 3: Build the Application
echo.
echo =================================================================
echo [Phase 3/3] Building the final application and installer (.msi)...
echo This is the longest step and will open a new window.
echo Please be patient. Ignore any warnings unless the process stops.
echo =================================================================
echo.

start "Building Application" cmd /c "npm run tauri build && echo. && echo [SUCCESS] Build complete! You can find the installer in 'src-tauri/target/release/bundle/msi'. Please close this window. && pause"

:CHECK_BUILD
if not exist "src-tauri\target\release\bundle\msi" (
    echo Waiting for the build to complete...
    timeout /t 15 >nul
    goto :CHECK_BUILD
)

echo.
echo =========================================================================
echo      BUILD SUCCESSFUL! The application has been packaged.
ECHO =========================================================================
echo.

:: Final Step: Open the installer folder
set "MSI_PATH=%CD%\src-tauri\target\release\bundle\msi\"

echo The Windows installer (.msi) is located at:
echo %MSI_PATH%
echo.

set /p open_folder="Would you like to open this folder now? (y/n): "
if /i "%open_folder%"=="y" (
    echo Opening the folder...
    explorer "%MSI_PATH%"
)

echo.
echo Script finished.
pause
