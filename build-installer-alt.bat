@echo off
echo Building N&S Tailors Installer (Alternative Method)...
echo.

:: Change to the project directory
cd /d "%~dp0"

:: Clean dist folder
if exist "dist" (
    echo Cleaning previous build...
    rmdir /s /q "dist"
    echo.
)

:: Build with specific NSIS target
echo Building with NSIS installer...
echo This may take several minutes...
echo.
npx electron-builder --win nsis --x64 --publish=never

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
    echo ❌ No .exe file found!
    echo.
    echo Trying portable build instead...
    npx electron-builder --win portable --x64 --publish=never
    echo.
    if exist "dist\*.exe" (
        echo ✅ Portable build completed!
        for %%f in (dist\*.exe) do echo "%%f"
        explorer dist
    ) else (
        echo ❌ Both builds failed. Check the console output above.
        if exist "dist" (
            echo Contents of dist folder:
            dir dist
        )
    )
)
echo.
pause
