@echo off
echo Installing Tailor Management System dependencies...
echo This may take a few minutes...

:: Install Node.js dependencies
npm install

:: Install dev dependencies
npm install --save-dev electron-builder

echo.
echo Dependencies installed successfully!
echo.
echo To start the application, run:
echo npm start
echo.
pause
