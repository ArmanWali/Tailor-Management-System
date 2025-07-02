/**
 * Configuration file for Tailor Management System
 */

module.exports = {
    // Application name
    appName: 'Noor & Sons Tailors Management System',

    // Database configuration
    database: {
        // The directory where the NeDB databases will be stored
        // By default, it uses the userData directory provided by Electron
        directory: null, // Set to null to use app.getPath('userData')

        // Database file names
        files: {
            users: 'users.db',
            customers: 'customers.db',
            settings: 'settings.db'
        }
    },    // Default admin credentials (only used if no admin user exists)
    defaultAdmin: {
        username: 'M.ABUBAKKAR',
        password: 'MASTER16203', // Should be changed after first login
        name: 'Administrator'
    },    // Print settings
    print: {
        // Paper size options for printing - Custom size (421px × 595px at 72 DPI)
        paperSize: 'custom', // 'A4', 'Letter', 'custom', etc.

        // Custom page dimensions (421px × 595px at 72 DPI = 5.85in × 8.26in)
        customSize: {
            width: '421px',    // 5.85 inches at 72 DPI
            height: '595px',   // 8.26 inches at 72 DPI
            unit: 'px'
        },

        // Print margins (in mm)
        margins: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        }
    },

    // Application settings
    settings: {
        // Language options
        language: 'en', // 'en' for English, 'ur' for Urdu

        // Auto backup settings
        autoBackup: {
            enabled: true,
            intervalDays: 7, // Backup data every 7 days
            maxBackups: 5 // Keep last 5 backups
        }
    }
};
