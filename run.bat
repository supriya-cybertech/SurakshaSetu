@echo off
setlocal ENABLEDELAYEDEXPANSION

:: ===================================================
:: 🚀 SurakshaSetu System Launcher
:: ===================================================

echo.
echo ===================================================
echo        🚀 Starting SurakshaSetu System
echo ===================================================
echo.

:: =======================
:: 1. Start WhatsApp Bridge
:: =======================
echo [1/4] Starting WhatsApp Bridge...
start "WhatsApp Bridge" cmd /k "cd backend\whatsapp_integration && npm install && npm start"

:: =======================
:: 2. Start Backend Server
:: =======================
echo [2/4] Starting Backend Server...
start "SurakshaSetu Backend" cmd /k "cd backend && (
    if exist venv\Scripts\activate (
        echo Activating virtual environment...
        call venv\Scripts\activate
    ) else (
        echo ❌ No venv found! Using global Python...
    )
) && python -m SERVER.main"

:: =======================
:: 3. Start Agent UI (Streamlit)
:: =======================
echo [3/4] Starting Agent UI...
start "Agent UI" cmd /k "cd backend && (
    if exist venv\Scripts\activate (
        echo Activating virtual environment...
        call venv\Scripts\activate
    ) else (
        echo ❌ No venv found! Using global Python...
    )
) && streamlit run agent_ui\activation_page.py"

:: =======================
:: 4. Start Frontend (Vite)
:: =======================
echo [4/4] Starting Frontend...
start "SurakshaSetu Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ===================================================
echo      ✅ All systems launched successfully!
echo ===================================================
echo.
echo  - Backend API Docs:   http://localhost:8000/docs
echo  - Frontend App:       http://localhost:5173
echo  - Agent UI:           http://localhost:8501
echo.
pause
