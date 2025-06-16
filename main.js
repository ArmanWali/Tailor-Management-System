const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Datastore = require('@seald-io/nedb');
const config = require('./config');

// Enable live reload for development
try {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit'
    });
} catch (err) {
    console.log('Electron reload not available in production mode');
}

// Set up database directory
const dbDir = config.database.directory || app.getPath('userData');

// Initialize database
const db = {
    users: new Datastore({
        filename: path.join(dbDir, config.database.files.users),
        autoload: true
    }),
    customers: new Datastore({
        filename: path.join(dbDir, config.database.files.customers),
        autoload: true
    }),
    settings: new Datastore({
        filename: path.join(dbDir, config.database.files.settings),
        autoload: true
    })
};

// Create admin user if not exists
db.users.findOne({ username: config.defaultAdmin.username }, (err, user) => {
    if (!user) {
        db.users.insert({
            username: config.defaultAdmin.username,
            password: config.defaultAdmin.password, // In production, use a hashed password
            name: config.defaultAdmin.name,
            role: 'admin',
            createdAt: new Date().toISOString()
        });
    }
});

// Keep a global reference of the window object
let mainWindow;
let printPreviewWindow;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        }
    });

    // Load the index.html file
    mainWindow.loadFile('src/index.html');

    // Open the DevTools in development
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

// Create print preview window
function createPrintPreviewWindow(customerId = null) {
    if (printPreviewWindow) {
        printPreviewWindow.focus();
        if (customerId) {
            printPreviewWindow.loadFile('src/pages/print-preview.html', {
                query: { id: customerId }
            });
        }
        return;
    }

    printPreviewWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        },
        title: 'Live Print Preview - Noor & Sons Tailors'
    });

    // Load the print preview page
    if (customerId) {
        printPreviewWindow.loadFile('src/pages/print-preview.html', {
            query: { id: customerId }
        });
    } else {
        printPreviewWindow.loadFile('src/pages/print-preview.html');
    }

    // Open DevTools for print preview (useful for styling adjustments)
    if (process.env.NODE_ENV === 'development') {
        printPreviewWindow.webContents.openDevTools();
    }

    printPreviewWindow.on('closed', function () {
        printPreviewWindow = null;
    });

    return printPreviewWindow;
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    createWindow();

    // Check for command line arguments
    const args = process.argv.slice(2);
    const customerIdArg = args.find(arg => arg.startsWith('--customer-id='));

    if (customerIdArg) {
        const customerId = customerIdArg.split('=')[1];
        if (customerId) {
            console.log(`Opening customer detail with ID: ${customerId}`);
            // Wait for main window to be ready
            setTimeout(() => {
                mainWindow.loadFile('src/customer-detail.html', {
                    query: { id: customerId }
                });
            }, 1000);
        }
    }
});

// Quit when all windows are closed
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

// IPC handlers for database operations
ipcMain.on('login', (event, { username, password }) => {
    db.users.findOne({ username, password }, (err, user) => {
        if (err || !user) {
            event.reply('login-response', { success: false });
        } else {
            event.reply('login-response', { success: true, user });
        }
    });
});

ipcMain.on('add-customer', (event, customerData) => {
    customerData.createdAt = new Date().toISOString();
    db.customers.insert(customerData, (err, newDoc) => {
        if (err) {
            event.reply('add-customer-response', { success: false, error: err });
        } else {
            event.reply('add-customer-response', { success: true, customer: newDoc });
        }
    });
});

ipcMain.on('get-customers', (event) => {
    db.customers.find({}).sort({ createdAt: -1 }).exec((err, customers) => {
        if (err) {
            event.reply('get-customers-response', { success: false, error: err });
        } else {
            event.reply('get-customers-response', { success: true, customers });
        }
    });
});

ipcMain.on('search-customers', (event, { query }) => {
    const searchRegex = new RegExp(query, 'i');
    db.customers.find({
        $or: [
            { name: searchRegex },
            { cellNumber: searchRegex },
            { codeNumber: searchRegex }
        ]
    }).exec((err, customers) => {
        if (err) {
            event.reply('search-customers-response', { success: false, error: err });
        } else {
            event.reply('search-customers-response', { success: true, customers });
        }
    });
});

ipcMain.on('update-customer', (event, { id, updatedData }) => {
    db.customers.update({ _id: id }, { $set: updatedData }, {}, (err, numReplaced) => {
        if (err) {
            event.reply('update-customer-response', { success: false, error: err });
        } else {
            event.reply('update-customer-response', { success: true, numReplaced });
        }
    });
});

// Get a single customer by ID
ipcMain.on('get-customer', (event, { id }) => {
    db.customers.findOne({ _id: id }, (err, customer) => {
        if (err || !customer) {
            event.reply('get-customer-response', { success: false, error: err || 'Customer not found' });
        } else {
            event.reply('get-customer-response', { success: true, customer });
        }
    });
});

// Delete customer
ipcMain.on('delete-customer', (event, { id }) => {
    db.customers.remove({ _id: id }, {}, (err, numRemoved) => {
        if (err) {
            event.reply('delete-customer-response', { success: false, error: err });
        } else {
            event.reply('delete-customer-response', { success: true, numRemoved });
        }
    });
});

// Print Preview IPC Handlers
ipcMain.on('open-print-preview', (event, { customerId }) => {
    createPrintPreviewWindow(customerId);
});

// Print page using Electron's print API
ipcMain.on('print-page', (event) => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
        focusedWindow.webContents.print({
            silent: false,
            printBackground: true,
            color: false,
            margins: {
                marginType: 'minimum'
            },
            landscape: false,
            scaleFactor: 100,
            pagesPerSheet: 1,
            collate: false,
            copies: 1
        });
    }
});

// Export to PDF (backup functionality)
ipcMain.on('export-to-pdf', (event) => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
        const { dialog } = require('electron');
        
        dialog.showSaveDialog(focusedWindow, {
            title: 'Export Print Form to PDF',
            defaultPath: `print-form-${new Date().toISOString().split('T')[0]}.pdf`,
            filters: [
                { name: 'PDF Files', extensions: ['pdf'] }
            ]
        }).then(result => {
            if (!result.canceled) {
                focusedWindow.webContents.printToPDF({
                    printBackground: true,
                    color: false,
                    margins: {
                        marginType: 'minimum'
                    },
                    landscape: false,
                    scaleFactor: 100
                }).then(data => {
                    require('fs').writeFileSync(result.filePath, data);
                    event.reply('export-pdf-response', { success: true, path: result.filePath });
                }).catch(err => {
                    event.reply('export-pdf-response', { success: false, error: err.message });
                });
            }
        });
    }
});

// Open DevTools for current window
ipcMain.on('open-devtools', (event) => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
        focusedWindow.webContents.openDevTools();
    }
});
