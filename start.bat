@echo off
start cmd /k "cd /d C:\Users\rlee21\Documents\MVT_helper\backend && pipenv run python app.py"
start cmd /k "cd /d C:\Users\rlee21\Documents\MVT_helper\frontend && npm run dev"
start chrome.exe "http://localhost:5173/"