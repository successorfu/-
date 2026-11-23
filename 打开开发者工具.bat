@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title 打开微信开发者工具并导入项目

set "PROJ=E:\智能鱼病诊断\小程序"
set "FOUND="

if not exist "%PROJ%\app.json" (
  echo [错误] 没找到项目：%PROJ%
  echo 请确认文件夹还在，或手动在开发者工具里导入。
  pause
  exit /b 1
)

for %%P in (
  "C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat"
  "C:\Program Files\Tencent\微信web开发者工具\cli.bat"
  "D:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat"
  "D:\Program Files\Tencent\微信web开发者工具\cli.bat"
  "E:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat"
) do (
  if exist %%P set "FOUND=%%~P"
)

if not defined FOUND (
  echo.
  echo 没在常见路径找到 cli.bat，请改用「手动导入」：
  echo   1. 打开微信开发者工具
  echo   2. 点「导入项目」
  echo   3. 目录选：%PROJ%
  echo   4. AppID 选「测试号」或点「游客模式」
  echo   5. 点确定
  echo.
  echo 如果工具装在别的盘，把 cli.bat 的完整路径告诉我，我给你改这个文件。
  pause
  exit /b 1
)

echo 找到 CLI：%FOUND%
echo 正在打开项目：%PROJ%
echo.

call "%FOUND%" open --project "%PROJ%"

if errorlevel 1 (
  echo.
  echo [失败] 可能是「服务端口」没开。
  echo 解决：开发者工具 - 设置 - 安全设置 - 打开「服务端口」，
  echo       或直接用「导入项目」手动选目录。
)

pause
