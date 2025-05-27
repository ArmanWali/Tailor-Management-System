@echo off
echo Testing Tailor Management System Collar/Ben Dropdown Functionality

:: Define test data
set "TEST_CODE=TS456"
set "TEST_NAME=Dropdown Test"

echo Running test with customer code: %TEST_CODE%
echo Starting application...

:: Start the app
start "" "c:\Users\Hp\OneDrive - Higher Education Commission\Projects\Tailor-Management-System\run.bat"

echo.
echo TEST STEPS:
echo -----------
echo 1. Login with username: admin, password: admin123
echo 2. Click on "Add New Customer"
echo 3. Fill in the basic details:
echo    - Code Number: %TEST_CODE%
echo    - Name: %TEST_NAME%
echo 4. Test the بین / کالر dropdown functionality:
echo    - Select "بین" from the dropdown
echo    - Verify that options "چورس", "کٹ", "گول" appear in the style dropdown
echo    - Select "کالر" from the dropdown
echo    - Verify that options "انگلش", "فرنچ", "نوک والا" appear in the style dropdown
echo 5. Save the customer and verify in Manage Customers

echo.
echo Press any key to exit this test script...
pause > nul
