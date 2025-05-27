/**
 * Database backup utility for Tailor Management System
 */

const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const config = require('./config');

// Directory where the database files are stored
const dbDir = config.database.directory || app.getPath('userData');

// Directory where backups will be stored
const backupDir = path.join(app.getPath('userData'), 'backups');

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

/**
 * Create a backup of all database files
 * @returns {string} Backup directory path
 */
function createBackup() {
    // Create timestamp-based backup folder
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFolder = path.join(backupDir, `backup-${timestamp}`);

    fs.mkdirSync(backupFolder, { recursive: true });

    // Get all database files
    const dbFiles = [
        config.database.files.users,
        config.database.files.customers,
        config.database.files.settings
    ];

    // Copy each database file to backup folder
    dbFiles.forEach(file => {
        const srcFile = path.join(dbDir, file);
        const destFile = path.join(backupFolder, file);

        if (fs.existsSync(srcFile)) {
            fs.copyFileSync(srcFile, destFile);
        }
    });

    console.log(`Backup created at: ${backupFolder}`);

    // Cleanup old backups if needed
    cleanupOldBackups();

    return backupFolder;
}

/**
 * Restore from a specific backup
 * @param {string} backupFolder Path to backup folder
 * @returns {boolean} Success status
 */
function restoreBackup(backupFolder) {
    if (!fs.existsSync(backupFolder)) {
        console.error(`Backup folder not found: ${backupFolder}`);
        return false;
    }

    // Get all database files
    const dbFiles = [
        config.database.files.users,
        config.database.files.customers,
        config.database.files.settings
    ];

    // Copy each backup file to the database directory
    dbFiles.forEach(file => {
        const srcFile = path.join(backupFolder, file);
        const destFile = path.join(dbDir, file);

        if (fs.existsSync(srcFile)) {
            // Create a backup of current file before replacing
            if (fs.existsSync(destFile)) {
                const tempBackup = `${destFile}.bak`;
                fs.copyFileSync(destFile, tempBackup);
            }

            // Copy the backup file to the database directory
            fs.copyFileSync(srcFile, destFile);
        }
    });

    console.log(`Restore completed from: ${backupFolder}`);
    return true;
}

/**
 * Get a list of available backups
 * @returns {Array} Array of backup folder names with timestamps
 */
function getAvailableBackups() {
    if (!fs.existsSync(backupDir)) {
        return [];
    }

    const backups = fs.readdirSync(backupDir)
        .filter(folder => folder.startsWith('backup-'))
        .map(folder => {
            const folderPath = path.join(backupDir, folder);
            const stats = fs.statSync(folderPath);

            return {
                name: folder,
                path: folderPath,
                timestamp: stats.mtime
            };
        })
        .sort((a, b) => b.timestamp - a.timestamp); // Sort by date, newest first

    return backups;
}

/**
 * Clean up old backups, keeping only the most recent ones
 * based on the configuration
 */
function cleanupOldBackups() {
    if (!config.settings.autoBackup.enabled) return;

    const maxBackups = config.settings.autoBackup.maxBackups;
    const backups = getAvailableBackups();

    if (backups.length > maxBackups) {
        // Remove oldest backups beyond the max limit
        const toRemove = backups.slice(maxBackups);

        toRemove.forEach(backup => {
            try {
                // Delete backup folder and all its contents
                fs.rmSync(backup.path, { recursive: true });
                console.log(`Removed old backup: ${backup.name}`);
            } catch (error) {
                console.error(`Error removing backup ${backup.name}:`, error);
            }
        });
    }
}

module.exports = {
    createBackup,
    restoreBackup,
    getAvailableBackups,
    backupDir
};
