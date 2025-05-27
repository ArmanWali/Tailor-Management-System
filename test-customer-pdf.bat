@echo off 
echo Testing Customer Detail PDF Generation... 
cd /d "%~dp0" 
set CUSTOMER_ID=1 
echo Opening customer detail with ID: %CUSTOMER_ID% for PDF generation 
start npm start -- --customer-id=%CUSTOMER_ID% 
