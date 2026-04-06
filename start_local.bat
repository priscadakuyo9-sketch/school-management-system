@echo off
echo ========================================================
echo Lancement de la Base de Donnees Locale SQLite configuree
echo ========================================================
echo.
echo 1. Lancement de l'API Backend... (Port 5000)
start "EduManage - BACKEND API" cmd /k "cd backend && npm run dev"

echo 2. Lancement du Dashboard Frontend... (Port 5173)
start "EduManage - FRONTEND DASHBOARD" cmd /k "cd frontend && npm run dev -- --open"

echo.
echo Tout est lance ! Regardez les deux autres fenetres qui viennent de s'ouvrir.
echo Le tableau de bord va s'ouvrir automatiquement dans votre navigateur.
pause
