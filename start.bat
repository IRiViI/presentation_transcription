@echo off
echo ========================================
echo Presentatie Vertaal Applicatie
echo ========================================
echo.

echo Starten van Backend Server...
start cmd /k "cd backend && venv\Scripts\activate && python main.py"

echo Wachten 3 seconden...
timeout /t 3 /nobreak >nul

echo Starten van Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Servers worden gestart!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Druk op een toets om af te sluiten...
pause >nul
