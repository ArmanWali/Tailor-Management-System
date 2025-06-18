@echo off
echo Building N&S Tailors Installer...
echo.

:: Change to the project directory
cd /d "%~dp0"

:: Clean dist folder
if exist "dist" (
    echo Cleaning previous build...
    rmdir /s /q "dist"
    echo.
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

:: Build the installer with verbose output
echo Building installer...
echo This may take a few minutes...
echo.
npm run build:installer -- --publish=never

echo.
if exist "dist\*.exe" (
    echo ✅ Build completed successfully!
    echo.
    echo Your installer is ready:
    for %%f in (dist\*.exe) do echo "%%f"
    echo.
    echo Opening dist folder...
    explorer dist
) else (
    echo ❌ Build completed but no .exe file found!
    echo Check the console output above for errors.
    echo.
    if exist "dist" (
        echo Contents of dist folder:
        dir dist
    )
)
echo.
pause
