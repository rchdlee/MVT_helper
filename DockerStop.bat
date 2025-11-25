@echo off
echo Stopping application...

echo Stopping Docker containers...
docker compose down

echo Shutting down WSL (this will terminate Vmmem)...
wsl --shutdown

echo Done.
pause
