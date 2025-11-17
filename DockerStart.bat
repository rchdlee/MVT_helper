@echo off
echo Starting application...
start http://localhost:5173
docker compose up --build
pause
