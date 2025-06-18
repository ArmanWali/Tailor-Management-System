// Dashboard initialization
document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard DOM loaded');

    try {
        // Check if user is logged in (optional for development)
        checkUserSession();        // Set up event listeners
        setupEventListeners();

        // Initialize backup status display
        initializeBackupStatus();

        console.log('Dashboard initialized successfully');
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
});

// Check user session (optional authentication check)
function checkUserSession() {
    try {
        const user = sessionStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            console.log('User logged in:', userData.username);
        } else {
            console.log('No user session found, but allowing access for development');
            // In production, you might want to redirect to login:
            // window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error checking user session:', error);
    }
}

// Set up all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners');

    // Logout link
    if (document.getElementById('logout-link')) {
        console.log('Found logout-link');
        document.getElementById('logout-link').addEventListener('click', function (e) {
            console.log('Logout link clicked');
            e.preventDefault();
            logout();
        });
    } else {
        console.error('logout-link element not found');
    }

    // Dashboard cards navigation
    if (document.getElementById('add-customer-card')) {
        console.log('Found add-customer-card');
        document.getElementById('add-customer-card').addEventListener('click', function () {
            console.log('Add customer card clicked');
            window.location.href = 'add-customer.html';
        });
    } else {
        console.error('add-customer-card element not found');
    }

    if (document.getElementById('manage-customers-card')) {
        console.log('Found manage-customers-card');
        document.getElementById('manage-customers-card').addEventListener('click', function () {
            console.log('Manage customers card clicked');
            window.location.href = 'manage-customers.html';
        });
    } else {
        console.error('manage-customers-card element not found');
    }
}

// Logout function
function logout() {
    console.log('Logging out');

    try {
        // Clear any stored user data
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');        // Redirect to login page
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Error logging out. Please try closing the application.');
    }
}

// Initialize backup status display
function initializeBackupStatus() {
    try {
        // Wait for backup system to be ready
        setTimeout(() => {
            if (window.autoBackup) {
                const stats = window.autoBackup.getBackupStats();
                updateBackupStats(stats);
                updateBackupPath(stats.backupPath);
                console.log('✅ Backup status initialized');
            } else {
                console.warn('⚠️ Backup system not loaded yet');
                // Try again in 1 second
                setTimeout(initializeBackupStatus, 1000);
            }
        }, 500);
    } catch (error) {
        console.error('Error initializing backup status:', error);
    }
}

// Update backup path display
function updateBackupPath(path) {
    try {
        const pathElement = document.getElementById('backup-path');
        if (pathElement && path) {
            pathElement.textContent = path;
        }
    } catch (error) {
        console.error('Error updating backup path:', error);
    }
}

// Update backup statistics display
function updateBackupStats(stats) {
    try {
        const statsElement = document.getElementById('backup-stats');
        if (statsElement && stats) {
            let statusText = '';

            if (stats.totalBackups > 0) {
                statusText = `📊 Auto backups: <strong>${stats.individualBackups}</strong> | Full backups: <strong>${stats.fullBackups}</strong>`;

                if (stats.lastBackup) {
                    const lastBackupDate = new Date(stats.lastBackup.timestamp);
                    const timeAgo = getTimeAgo(lastBackupDate);
                    statusText += ` | 🕒 Last: <strong>${timeAgo}</strong>`;
                }
            } else {
                statusText = '📊 No backups created yet. Add your first customer to create a backup!';
            }

            statsElement.innerHTML = `<small class="text-info">${statusText}</small>`;
        }
    } catch (error) {
        console.error('Error updating backup stats:', error);
    }
}

// Get human-readable time ago
function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Manual backup function (called from dashboard button)
async function createManualBackup() {
    try {
        if (!window.autoBackup) {
            alert('❌ Backup system is not available. Please refresh the page.');
            return;
        }

        console.log('📦 Creating manual full backup...');

        // Show loading state
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="bi bi-hourglass-split"></i> Creating...';
        button.disabled = true;

        // Create full backup
        const result = await window.autoBackup.createFullBackup();

        // Restore button state
        button.innerHTML = originalText;
        button.disabled = false;

        if (result.success) {
            const backupPath = window.autoBackup.getBackupPath();
            alert(`✅ Full backup created successfully!\n\n` +
                `📁 Location: ${backupPath}\n` +
                `📄 Filename: ${result.filename}\n` +
                `👥 Customers backed up: ${result.customerCount}\n\n` +
                `This backup contains all your customer data and will overwrite any existing full backup file.`);

            // Update stats
            const stats = window.autoBackup.getBackupStats();
            updateBackupStats(stats);
        } else {
            alert(`❌ Failed to create full backup.\n\nError: ${result.error}\n\nPlease try again.`);
        }

    } catch (error) {
        console.error('Error creating manual backup:', error);
        alert('❌ Error creating backup: ' + error.message);
    }
}

// Open backup folder function
async function openBackupFolder() {
    try {
        if (!window.autoBackup) {
            alert('❌ Backup system is not available. Please refresh the page.');
            return;
        }

        const success = await window.autoBackup.openBackupFolder();

        if (!success) {
            const backupPath = window.autoBackup.getBackupPath();
            alert(`📁 Backup folder location:\n${backupPath}\n\nPlease navigate to this folder manually to access your backup files.`);
        }

    } catch (error) {
        console.error('Error opening backup folder:', error);
        alert('❌ Error opening backup folder: ' + error.message);
    }
}

// Make functions available globally for button onclick
window.createManualBackup = createManualBackup;
window.openBackupFolder = openBackupFolder;

