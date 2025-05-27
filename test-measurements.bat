@echo off
echo Testing Tailor Management System Measurement Save Functionality

:: Define test data
set "TEST_CODE=TS123"
set "TEST_NAME=Test Customer"
set "TEST_PHONE=1234567890"

echo Running test with customer code: %TEST_CODE%
echo Starting application...

:: Start the app
start "" "c:\Users\Hp\OneDrive - Higher Education Commission\Projects\Tailor-Management-System\run.bat"

echo.
echo TEST STEPS:
echo -----------
echo 1. Login with username: admin, password: admin123
echo 2. Click on "Add New Customer"
echo 3. Fill in the following details:
echo    - Code Number: %TEST_CODE%
echo    - Name: %TEST_NAME%
echo    - Cell Number: %TEST_PHONE%
echo    - Fill in all measurement fields including:
echo      * Collar type: کالر
echo      * Collar style: انگلش
echo      * All Shalwar measurements
echo      * All Cuff/Plate options
echo 4. Click "Save Customer"
echo 5. Go to "Manage Customers"
echo 6. Search for the customer code: %TEST_CODE%
echo 7. Click "View" to verify all measurements were saved correctly

echo.
echo Press any key to exit this test script...
pause > nul
