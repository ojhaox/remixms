@echo off
echo Starting WAMP services...
net start wampapache64
net start wampmysqld64

echo Starting Node.js server...
cd C:\wamp64\www\remixms\server
start cmd /k "node server.js"

echo.
echo ===========================================
echo Website is accessible through WAMP at:
echo http://localhost/remixms
echo http://localhost/remixms/register.html
echo.
echo Node.js API server running on:
echo http://localhost:3000
echo ===========================================
echo.
echo Press any key to exit...
pause > nul 