# Tailor Management System - Pages Directory

## 📁 File Organization (Updated Structure)

### Pages Directory (`src/pages/`):
All application pages are now organized in this directory:

- **dashboard.html** - Main dashboard with statistics and navigation cards
- **add-customer.html** - Form to add new customers with detailed measurements
- **manage-customers.html** - List and manage existing customers
- **customer-detail.html** - View/edit individual customer details with print functionality

### Entry Point:
- **src/index.html** - Login page (remains in root src directory)

### Supporting Directories:
- **src/assets/** - Images, fonts, and static resources
- **src/css/** - Stylesheets (Bootstrap, custom styles, icons)  
- **src/js/** - JavaScript functionality for each page

## 🔗 Navigation Flow:
1. **Login** (`index.html`) → **Dashboard** (`pages/dashboard.html`)
2. **Dashboard** → **Add Customer** (`pages/add-customer.html`)
3. **Dashboard** → **Manage Customers** (`pages/manage-customers.html`)
4. **Manage Customers** → **Customer Details** (`pages/customer-detail.html`)
5. All pages can **Logout** → **Login** (`../index.html`)

## ✅ Recent Changes:
- Organized all pages into `/pages/` directory
- Updated all relative paths in HTML files (`../css/`, `../js/`, `../assets/`)
- Fixed navigation paths in JavaScript files
- Removed redundant/backup files
- Consolidated duplicate implementations

## 🔧 Technical Notes:
- All CSS/JS/image references use relative paths from pages directory
- JavaScript navigation paths updated for new structure
- Print functionality preserved in customer-detail.html
- Responsive design maintained across all pages
5. Customer Details → Print Form (integrated print functionality)

### Key Features:
- **Print Form**: Custom A4 print layout with dual logos and measurement sections
- **Data Storage**: LocalStorage for customer data persistence
- **Responsive Design**: Mobile-friendly interface
- **Urdu Support**: Complete Urdu text support for measurements and labels
