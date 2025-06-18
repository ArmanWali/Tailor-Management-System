/**
 * Automatic Backup System for Tailor Management System
 * Creates backups every time customer data is saved
 * Stores backups in Documents/Customer Data Backup
 */

class AutoBackupSystem {
    constructor() {
        this.isElectron = typeof require !== 'undefined';
        this.backupPath = null;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            console.log('🔄 Initializing Auto Backup System...');

            // Set up backup path
            await this.setupBackupPath();

            // Create backup directory if it doesn't exist
            await this.ensureBackupDirectory();

            this.isInitialized = true;
            console.log('✅ Auto Backup System initialized successfully');
            console.log(`📁 Backup location: ${this.backupPath}`);
        } catch (error) {
            console.error('❌ Failed to initialize backup system:', error);
        }
    }

    /**
     * Setup backup path based on environment
     */
    async setupBackupPath() {
        try {
            if (this.isElectron) {
                const { app } = require('electron');
                const path = require('path');
                const os = require('os');

                // Use Documents folder to avoid admin rights issues
                const documentsPath = app.getPath('documents');
                this.backupPath = path.join(documentsPath, 'Customer Data Backup');
            } else {
                // Fallback for browser environment
                this.backupPath = 'Customer Data Backup';
            }
        } catch (error) {
            console.error('Error setting up backup path:', error);
            this.backupPath = 'Customer Data Backup';
        }
    }

    /**
     * Ensure backup directory exists
     */
    async ensureBackupDirectory() {
        try {
            console.log(`📁 Ensuring backup directory exists: ${this.backupPath}`);

            if (this.isElectron) {
                const fs = require('fs');
                if (!fs.existsSync(this.backupPath)) {
                    fs.mkdirSync(this.backupPath, { recursive: true });
                    console.log('✅ Backup directory created successfully');
                }
            }

            return true;
        } catch (error) {
            console.error('Error creating backup directory:', error);
            return false;
        }
    }    /**
     * Create backup when customer data is saved
     * @param {Object} customerData - The customer data being saved
     * @param {string} operation - 'add' or 'update'
     */
    async createBackup(customerData, operation = 'add') {
        if (!this.isInitialized) {
            console.warn('⚠️ Backup system not initialized, skipping backup');
            return false;
        }

        try {
            console.log(`💾 Creating automatic backup for customer: ${customerData.name}`);

            // Create backup data structure for single customer
            const backupData = {
                timestamp: new Date().toISOString(),
                operation: operation,
                backupType: 'individual',
                customerData: customerData,
                version: '1.0',
                source: 'Tailor Management System - Auto Backup'
            };

            // Generate unique filename for individual customer
            const filename = this.generateBackupFilename(customerData);

            // Save backup
            await this.saveBackupFile(filename, backupData);

            console.log(`✅ Automatic backup created successfully: ${filename}`);

            // Update backup tracking
            this.trackBackup(filename, backupData.timestamp, 'individual');

            return true;
        } catch (error) {
            console.error('❌ Failed to create automatic backup:', error);
            return false;
        }
    }

    /**
     * Generate unique backup filename
     * @param {Object} customerData - Customer data
     * @returns {string} Unique filename
     */
    generateBackupFilename(customerData) {
        try {
            // Clean customer name for filename
            const cleanName = this.sanitizeFilename(customerData.name || 'Unknown');

            // Get current date and time
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
            const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS

            // Use customer code if available
            const customerCode = customerData.codeNumber || customerData.id || 'NoCode';

            // Format: CustomerCode_CustomerName_Date_Time.json
            return `${customerCode}_${cleanName}_${dateStr}_${timeStr}.json`;
        } catch (error) {
            console.error('Error generating filename:', error);
            // Fallback filename
            return `Backup_${Date.now()}.json`;
        }
    }

    /**
     * Sanitize filename to remove invalid characters
     * @param {string} name - Raw filename
     * @returns {string} Clean filename
     */
    sanitizeFilename(name) {
        return name
            .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .substring(0, 50); // Limit length
    }    /**
     * Save backup file
     * @param {string} filename - Backup filename
     * @param {Object} data - Backup data
     */
    async saveBackupFile(filename, data) {
        try {
            const jsonString = JSON.stringify(data, null, 2);

            if (this.isElectron) {
                // Electron environment - save to file system
                const fs = require('fs');
                const path = require('path');
                const fullPath = path.join(this.backupPath, filename);

                // For manual full backup, check if file exists and handle overwrite
                if (data.backupType === 'full' && fs.existsSync(fullPath)) {
                    console.log(`📝 Overwriting existing full backup: ${filename}`);
                }

                fs.writeFileSync(fullPath, jsonString, 'utf8');
                console.log(`💾 Backup saved to: ${fullPath}`);

            } else {
                // Browser environment - trigger download
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.style.display = 'none';

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url);
            }

        } catch (error) {
            console.error('Error saving backup file:', error);
            throw error;
        }
    }

    /**
     * Track backup creation for monitoring
     * @param {string} filename - Backup filename
     * @param {string} timestamp - Backup timestamp
     * @param {string} type - Backup type ('individual' or 'full')
     */
    trackBackup(filename, timestamp, type = 'individual') {
        try {
            const backupLog = JSON.parse(localStorage.getItem('backupLog') || '[]');
            backupLog.push({
                filename: filename,
                timestamp: timestamp,
                type: type,
                status: 'created'
            });

            // Keep only last 100 backup records
            if (backupLog.length > 100) {
                backupLog.splice(0, backupLog.length - 100);
            }

            localStorage.setItem('backupLog', JSON.stringify(backupLog));
        } catch (error) {
            console.error('Error tracking backup:', error);
        }
    }    /**
     * Get backup statistics
     * @returns {Object} Backup stats
     */
    getBackupStats() {
        try {
            const backupLog = JSON.parse(localStorage.getItem('backupLog') || '[]');
            const individualBackups = backupLog.filter(b => b.type === 'individual' || !b.type);
            const fullBackups = backupLog.filter(b => b.type === 'full');

            return {
                totalBackups: backupLog.length,
                individualBackups: individualBackups.length,
                fullBackups: fullBackups.length,
                lastBackup: backupLog.length > 0 ? backupLog[backupLog.length - 1] : null,
                lastFullBackup: fullBackups.length > 0 ? fullBackups[fullBackups.length - 1] : null,
                isEnabled: this.isInitialized,
                backupPath: this.backupPath
            };
        } catch (error) {
            console.error('Error getting backup stats:', error);
            return {
                totalBackups: 0,
                individualBackups: 0,
                fullBackups: 0,
                lastBackup: null,
                lastFullBackup: null,
                isEnabled: false,
                backupPath: this.backupPath
            };
        }
    }

    /**
     * Manual backup of all data - overwrites existing full backup
     */
    async createFullBackup() {
        try {
            console.log('📦 Creating full backup of all customer data...');

            const allCustomers = JSON.parse(localStorage.getItem('customers') || '[]');

            const backupData = {
                timestamp: new Date().toISOString(),
                operation: 'full_backup',
                backupType: 'full',
                totalCustomers: allCustomers.length,
                allCustomersData: allCustomers,
                version: '1.0',
                source: 'Tailor Management System - Full Backup'
            };

            // Use fixed filename for full backup (will overwrite existing)
            const filename = 'FullBackup_AllCustomers.json';

            await this.saveBackupFile(filename, backupData);

            // Update tracking
            this.trackBackup(filename, backupData.timestamp, 'full');

            console.log('✅ Full backup created successfully');
            return {
                success: true,
                filename: filename,
                customerCount: allCustomers.length,
                path: this.backupPath
            };
        } catch (error) {
            console.error('❌ Failed to create full backup:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get backup folder path for display
     * @returns {string} Backup folder path
     */
    getBackupPath() {
        return this.backupPath;
    }

    /**
     * Open backup folder in file explorer (Electron only)
     */
    async openBackupFolder() {
        try {
            if (this.isElectron) {
                const { shell } = require('electron');
                await shell.openPath(this.backupPath);
                return true;
            } else {
                console.warn('Opening backup folder is only available in desktop app');
                return false;
            }
        } catch (error) {
            console.error('Error opening backup folder:', error);
            return false;
        }
    }
}

// Initialize the backup system
const autoBackup = new AutoBackupSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoBackupSystem;
}

// Make available globally
window.AutoBackupSystem = AutoBackupSystem;
window.autoBackup = autoBackup;

console.log('🔧 Backup system loaded and ready');
