@echo off
echo ====================================================
echo    BizFlow Development Launcher
echo ====================================================

echo [1/2] Starting Backend Server (Port 9999)...
start "BizFlow Backend" cmd /k "call .venv\Scripts\activate && python src\app.py"

echo [2/2] Starting Frontend Server (Port 3000)...
cd frontend
start "BizFlow Frontend" cmd /k "npm run dev"

echo.
echo SUCCESS!
echo - Backend API: http://localhost:9999
echo - Web App:     http://localhost:3000
echo.
echo Press any key to close this launcher (servers will keep running)...
pause >nul
