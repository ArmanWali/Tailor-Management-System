# Building N&S Tailors Installer

This guide will help you create an executable installer for the N&S Tailors application.

## Quick Start

### Method 1: Using the Batch File (Recommended)
1. Double-click `build-installer.bat`
2. Wait for the build process to complete
3. Find your installer in the `dist` folder

### Method 2: Using Command Line
1. Open Command Prompt or PowerShell in the project directory
2. Run: `npm install` (if not already done)
3. Run: `npm run build:installer`
4. Wait for the build process to complete

## What Gets Created

The build process will create:
- **N&S-Tailors-Setup-1.0.0.exe** - The main installer file
- Located in the `dist` folder

## Installer Features

✅ **Custom Name**: "N&S Tailors" (as requested)
✅ **Desktop Shortcut**: Creates a desktop shortcut
✅ **Start Menu**: Adds to Windows Start Menu
✅ **Custom Installation**: Users can choose installation directory
✅ **Uninstaller**: Includes uninstall functionality
✅ **Windows Compatible**: Optimized for Windows systems

## File Locations After Installation

When installed on a client's PC:
- **Program Files**: `C:\Users\[Username]\AppData\Local\Programs\N&S Tailors\`
- **Desktop Shortcut**: `Desktop\N&S Tailors.lnk`
- **Start Menu**: `Start Menu\Programs\N&S Tailors`

## Troubleshooting

### Build Fails
- Ensure Node.js is installed
- Run `npm install` first
- Check internet connection for downloading dependencies

### Missing Icon
- Icon file is located at: `src/assets/img/logo-pic.png`
- If missing, the installer will use a default icon

### Large File Size
- The .exe file may be 100-200MB+ due to bundled Electron runtime
- This is normal for Electron applications

## Distribution

The created installer file can be:
- Copied to USB drives
- Sent via email (if size permits)
- Uploaded to cloud storage
- Distributed via network shares

## System Requirements

**For Building:**
- Node.js 16 or higher
- npm package manager
- Windows 10/11

**For Installation:**
- Windows 10 or higher
- 200MB+ free disk space
- Administrator privileges (for installation)

## Technical Details

- **Build Tool**: electron-builder
- **Installer Type**: NSIS (Nullsoft Scriptable Install System)
- **Architecture**: x64 (64-bit)
- **Compression**: Automatic
- **Auto-updater**: Not configured (manual updates)

---

**Need Help?**
If you encounter issues, check the console output for detailed error messages.
