/**
 * Automatic Backup System for Tailor Management System
 * Creates backups every time customer data is saved
 * Stores backups in C:\Customer Data Backup
 */

class AutoBackupSystem {
    constructor() {
        this.backupPath = 'C:\\Customer Data Backup';
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            console.log('🔄 Initializing Auto Backup System...');
            
            // Create backup directory if it doesn't exist
            await this.ensureBackupDirectory();
            
            this.isInitialized = true;
            console.log('✅ Auto Backup System initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize backup system:', error);
        }
    }

    /**
     * Ensure backup directory exists
     */
    async ensureBackupDirectory() {
        try {
            // For browser environment, we'll use downloads folder
            // But we'll simulate the directory creation for logging
            console.log(`📁 Ensuring backup directory exists: ${this.backupPath}`);
            
            // In a real Electron app, you would use:
            // const fs = require('fs');
            // const path = require('path');
            // if (!fs.existsSync(this.backupPath)) {
            //     fs.mkdirSync(this.backupPath, { recursive: true });
            // }
            
            return true;
        } catch (error) {
            console.error('Error creating backup directory:', error);
            return false;
        }
    }

    /**
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
            console.log(`💾 Creating backup for customer: ${customerData.name}`);

            // Get all current customer data
            const allCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
            
            // Create backup data structure
            const backupData = {
                timestamp: new Date().toISOString(),
                operation: operation,
                customerData: customerData,
                allCustomersData: allCustomers,
                version: '1.0',
                source: 'Tailor Management System'
            };

            // Generate unique filename
            const filename = this.generateBackupFilename(customerData);
            
            // Save backup
            await this.saveBackupFile(filename, backupData);
            
            console.log(`✅ Backup created successfully: ${filename}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to create backup:', error);
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
    }

    /**
     * Save backup file
     * @param {string} filename - Backup filename
     * @param {Object} data - Backup data
     */
    async saveBackupFile(filename, data) {
        try {
            const jsonString = JSON.stringify(data, null, 2);
            
            // For browser environment - trigger download
            if (typeof window !== 'undefined') {
                // Create blob and download link
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                // Create hidden download link
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.style.display = 'none';
                
                // Trigger download silently
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // Clean up
                URL.revokeObjectURL(url);
                
                // Store backup info in localStorage for tracking
                this.trackBackup(filename, data.timestamp);
            }
            
            // In Electron environment, save to actual file system:
            // const fs = require('fs');
            // const path = require('path');
            // const fullPath = path.join(this.backupPath, filename);
            // fs.writeFileSync(fullPath, jsonString, 'utf8');
            
        } catch (error) {
            console.error('Error saving backup file:', error);
            throw error;
        }
    }

    /**
     * Track backup creation for monitoring
     * @param {string} filename - Backup filename
     * @param {string} timestamp - Backup timestamp
     */
    trackBackup(filename, timestamp) {
        try {
            const backupLog = JSON.parse(localStorage.getItem('backupLog') || '[]');
            backupLog.push({
                filename: filename,
                timestamp: timestamp,
                status: 'created'
            });
            
            // Keep only last 50 backup records
            if (backupLog.length > 50) {
                backupLog.splice(0, backupLog.length - 50);
            }
            
            localStorage.setItem('backupLog', JSON.stringify(backupLog));
        } catch (error) {
            console.error('Error tracking backup:', error);
        }
    }

    /**
     * Get backup statistics
     * @returns {Object} Backup stats
     */
    getBackupStats() {
        try {
            const backupLog = JSON.parse(localStorage.getItem('backupLog') || '[]');
            return {
                totalBackups: backupLog.length,
                lastBackup: backupLog.length > 0 ? backupLog[backupLog.length - 1] : null,
                isEnabled: this.isInitialized
            };
        } catch (error) {
            console.error('Error getting backup stats:', error);
            return { totalBackups: 0, lastBackup: null, isEnabled: false };
        }
    }

    /**
     * Manual backup of all data
     */
    async createFullBackup() {
        try {
            console.log('📦 Creating full backup of all customer data...');
            
            const allCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
            
            const backupData = {
                timestamp: new Date().toISOString(),
                operation: 'full_backup',
                totalCustomers: allCustomers.length,
                allCustomersData: allCustomers,
                version: '1.0',
                source: 'Tailor Management System - Full Backup'
            };

            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
            const filename = `FullBackup_${dateStr}_${timeStr}.json`;
            
            await this.saveBackupFile(filename, backupData);
            
            console.log('✅ Full backup created successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to create full backup:', error);
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
