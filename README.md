# Tailor Management System

A desktop application for managing customer measurement data for tailors. This system is built using Electron with HTML, CSS, and JavaScript. It supports bilingual (English/Urdu) content and PDF generation for customer measurement details.

## Features

- **Login Interface**: Secure admin login to access the system
- **Dashboard**: Easy navigation between different sections
- **Add New Customer**: Form to capture customer measurements in Urdu
- **Manage Customers**: Search, edit, and print customer data
- **PDF Generation**: Create professional PDF measurement cards for customers
- **Bilingual Support**: Interface and printed materials in both English and Urdu
- **Local Font Integration**: Embedded Urdu fonts for consistent display across systems
- **Print Optimization**: Enhanced styling for both PDF and direct printing

## Measurement System

The application includes a comprehensive measurement system for traditional Pakistani clothing:

1. **Shalwar Qameez (شلوار قمیص)** section includes:
   - Basic measurements (لمبائی, آستین, تیرا)
   - Collar options (بین/کالر with specific styles)
   - Body measurements (چھاتی, کمر, گیرہ, موزہ)
   - Pocket options (ڈبل سائیڈ پاکٹ, سنگل پاکٹ, فرنٹ پاکٹ)
   - Stitching details (سلائی, بٹن)

2. **Shalwar (شلوار)** section includes:
   - Length and type (شلوار لمبائی, عام/ٹروزر/سانجھا)
   - Detailed measurements (پاچہ, لب, اندر)
   - Pocket and border options (شلوار پاکٹ, پٹی)

3. **Cuff/Plate (کف/پلیٹ)** section includes:
   - Cuff style and buttons (پلیٹ والا کف/پلیٹ کے بغیر, کف کاج)
   - Side slit options (چک پٹی, چک پٹی کاج)
   - Bottom style and sleeve options (دامن, شولڈر, آستین)
   - Additional customizations (اینکشرا دیماند)

## Tech Stack

- **Electron**: For the desktop wrapper
- **HTML, CSS, JavaScript**: For the user interface
- **NeDB**: Local database for data storage
- **Bootstrap**: For responsive design
- **jsPDF & jsPDF-AutoTable**: For PDF generation
- **HTML2Canvas**: For capturing content for PDF output
- **Noto Nastaliq Urdu**: Local font for consistent Urdu rendering

## Installation

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)

### Steps

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/Tailor-Management-System.git
   cd Tailor-Management-System
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the application:
   ```
   npm start
   ```

## Default Login

- **Username**: admin
- **Password**: admin123

Please change the default password after the first login for security reasons.

## Usage

### Adding a New Customer

1. Login to the application
2. Click on "Add New Customer" on the dashboard
3. Fill in the customer details and measurements
4. Click "Save Customer"

### Managing Customers

1. Click on "Manage Customers" on the dashboard
2. Use the search box to find customers
3. Click "View" to see customer details
4. Click "Edit" to modify customer data
5. Click "Print" to generate a PDF measurement card

### Generating PDFs

There are two ways to generate PDFs:
1. From the customer detail view, click the "Print" button
2. For testing, use the included batch scripts:
   - `test-pdf.bat` - Tests the application with PDF functionality
   - `test-customer-pdf.bat` - Opens a specific customer's details for PDF generation

### PDF Customization

The PDF output includes:
- Shop logo (automatically included from HTML)
- Customer details (name, contact info, etc.)
- Bilingual measurement labels (English and Urdu)
- Organized measurement table
- Signature fields
- Footer text

### Printing Options

If PDF generation fails for any reason, the system will automatically fall back to using the browser's built-in print functionality.

## License

MIT

## Recent Updates (May 2025)

### Measurement System Improvements
- **Enhanced Collar/Ben Functionality**: Implemented dynamic dropdown behavior for collar type selection (بین/کالر) in both Add New Customer and Customer Details views
- **Unified Measurement Interface**: Ensured all measurement fields are consistent between Add New Customer form and Customer Details view
- **Improved User Experience**: Added proper CSS styling for measurement sections with better form layout and responsive design

### Database and Documentation Enhancements
- **Comprehensive Schema Documentation**: Created detailed database-schema.md file documenting all measurement fields and their possible values
- **Measurement Testing**: Added test-measurements.bat script to verify all measurements are being stored correctly
- **CSS Improvements**: Enhanced styling for the collar-ben-options class to ensure proper display in both forms

### Technical Improvements
- **Optimized Event Listeners**: Fixed duplicate event listeners in dashboard.js
- **Enhanced Dropdown Functionality**: Improved setupCollarTypeDropdown function to provide better user experience
- **Properly Initialized UI Components**: Ensured dropdown options are correctly initialized when the page loads

## Contact

For any questions or support, please contact [your contact information].