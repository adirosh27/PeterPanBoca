@echo off
cd /d "%~dp0"
echo Deploying peter-pan-boca to Vercel (production)...
call npx vercel --prod --yes > "%~dp0deploy-vercel.log" 2>&1
echo Exit code: %ERRORLEVEL% >> "%~dp0deploy-vercel.log"
type "%~dp0deploy-vercel.log"
pause
