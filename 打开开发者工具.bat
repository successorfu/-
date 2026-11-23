@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title 打开微信开发者工具并导入项目

rem 脚本所在目录即工程目录：克隆到任意路径后直接双击即可，不再写死绝对路径
set "PROJ=%~dp0"
if "%PROJ:~-1%"=="\" set "PROJ=%PROJ:~0,-1%"

if not exist "%PROJ%\app.json" (
  echo [错误] 当前目录不是小程序工程目录，没找到 app.json：
  echo         %PROJ%
  echo.
  echo 请把本脚本放在小程序根目录（与 app.json 同级）后再运行。
  pause
  exit /b 1
)

set "FOUND="

rem 1) 显式指定优先：把 cli.bat 拖到本脚本上运行，或用环境变量 WXDEVTOOLS 指定
if not "%~1"=="" if exist "%~1" set "FOUND=%~1"
if not defined FOUND if exist "%WXDEVTOOLS%" set "FOUND=%WXDEVTOOLS%"

rem 2) 扫常见安装路径：C/D/E/F/G 盘的默认位置 + 自定义安装盘常见的 WeChatDevTools
if not defined FOUND (
  for %%D in (C D E F G) do (
    if not defined FOUND (
      for %%P in (
        "%%D:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat"
        "%%D:\Program Files\Tencent\微信web开发者工具\cli.bat"
        "%%D:\Tencent\微信web开发者工具\cli.bat"
        "%%D:\Program Files\Tencent\微信开发者工具\cli.bat"
        "%%D:\Program Files (x86)\Tencent\微信开发者工具\cli.bat"
        "%%D:\WeChatDevTools\cli.bat"
        "%%D:\WechatDevTools\cli.bat"
      ) do (
        if exist "%%~P" set "FOUND=%%~P"
      )
    )
  )
)

if not defined FOUND (
  echo [未找到] 没在常见路径找到开发者工具的 cli.bat。
  echo.
  echo   1. 把 cli.bat 拖到本脚本上运行，可直接指定路径
  echo   2. 或设置环境变量 WXDEVTOOLS=cli.bat 的完整路径
  echo   3. 或手动：开发者工具 - 导入项目 - 目录选 %PROJ%
  echo.
  echo cli.bat 一般在「微信开发者工具安装目录」根下。
  pause
  exit /b 1
)

echo 找到 CLI：  %FOUND%
echo 项目目录：  %PROJ%
echo 正在打开并导入项目...
echo.

call "%FOUND%" open --project "%PROJ%"

if errorlevel 1 (
  echo.
  echo [失败] 常见原因：开发者工具没启动、没登录，或「服务端口」未开启。
  echo        开发者工具 - 设置 - 安全设置 - 打开「服务端口」后重试。
  pause
  exit /b 1
)

echo 完成。
exit /b 0
