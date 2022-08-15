@echo off
IF EXIST "node_modules" (
    cls & electron .
) ELSE (
    npm install & cls & electron .
)
pause