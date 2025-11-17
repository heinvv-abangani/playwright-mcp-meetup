@echo off
REM Playwright MCP Demo Setup Script for Windows

echo ================================
echo Playwright MCP Security Demo Setup
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo X Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js found
node --version
echo.

REM Set config path
set CONFIG_PATH=%APPDATA%\Claude\claude_desktop_config.json

echo Config path: %CONFIG_PATH%
echo.

REM Create config directory if it doesn't exist
if not exist "%APPDATA%\Claude" (
    echo Creating config directory...
    mkdir "%APPDATA%\Claude"
)

REM Backup existing config
if exist "%CONFIG_PATH%" (
    echo Backing up existing config...
    copy "%CONFIG_PATH%" "%CONFIG_PATH%.backup" >nul
    echo.
    echo Existing config found. Please manually add this to your config:
    echo.
    echo   "playwright": {
    echo     "command": "npx",
    echo     "args": ["@playwright/mcp@latest"]
    echo   }
    echo.
) else (
    echo Creating new config file...
    (
        echo {
        echo   "mcpServers": {
        echo     "playwright": {
        echo       "command": "npx",
        echo       "args": ["@playwright/mcp@latest"]
        echo     }
        echo   }
        echo }
    ) > "%CONFIG_PATH%"
    echo [OK] Created new config file
    echo.
)

REM Install Playwright browsers
echo Installing Playwright browsers (this may take a few minutes^)...
call npx playwright install chromium

echo.
echo ================================
echo [OK] Setup complete!
echo ================================
echo.
echo Next Steps:
echo 1. Restart Claude Desktop (quit completely and reopen^)
echo 2. Start the test server:
echo    cd test-site
echo    npx http-server -p 8080
echo 3. In Claude Desktop, try this prompt:
echo    'Navigate to http://localhost:8080 and find security issues'
echo.
echo Documentation:
echo    - Quick Start: QUICK_START.md
echo    - Demo Guide: DEMO_GUIDE.md
echo    - Ready Prompts: DEMO_PROMPTS.md
echo.
echo You're ready to demo!
echo.
pause
