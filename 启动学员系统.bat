@echo off
echo ========================================
echo   侨邦国际教育 - 学员管理系统启动器
echo ========================================
echo.

echo [1/3] 检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到Node.js，请先安装Node.js
    pause
    exit /b 1
)
echo ✅ Node.js环境正常
echo.

echo [2/3] 启动后端服务（端口3001）...
start "后端服务" cmd /k "cd /d "%~dp0backend" && echo 正在启动后端服务... && echo 端口：3001 && echo 数据文件：data.json && echo. && node server.js"
echo ✅ 后端服务启动中
echo.

echo [3/3] 启动前端开发服务器（端口3000）...
timeout /t 3 >nul
start "前端服务" cmd /k "cd /d "%~dp0frontend" && echo 正在启动前端开发服务器... && echo 端口：3000 && echo 请等待编译完成... && echo. && npm start"
echo ✅ 前端服务启动中
echo.

echo ========================================
echo   启动完成：
echo ========================================
echo.
echo 🌐 访问地址：http://localhost:3000
echo 🔗 API地址：http://localhost:3001/api/students
echo.
echo 📋 使用说明：
echo   1. 两个服务窗口请勿关闭
echo   2. 前端会自动打开浏览器
echo   3. 按 Ctrl+C 可停止服务
echo   4. 关闭窗口即退出系统
echo.
echo 🚀 系统已经准备好，开始使用吧！
echo ========================================
pause