const { contextBridge, ipcRenderer } = require('electron');

// Log that the preload script is executing
console.log('Preload script is running');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
    send: (channel, data) => {
        // whitelist channels
        let validChannels = [
            'login',
            'add-customer',
            'get-customers',
            'search-customers',
            'update-customer',
            'delete-customer',
            'print-customer',
            'get-customer',
            'logout',
            'open-print-preview',
            'print-page',
            'export-to-pdf',
            'open-devtools'
        ];
        if (validChannels.includes(channel)) {
            console.log(`Sending message via ${channel}`, data);
            ipcRenderer.send(channel, data);
        } else {
            console.warn(`Invalid channel: ${channel}`);
        }
    },
    receive: (channel, func) => {
        let validChannels = [
            'login-response',
            'add-customer-response',
            'get-customers-response',
            'search-customers-response',
            'update-customer-response',
            'delete-customer-response',
            'get-customer-response',
            'export-pdf-response'
        ];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender` 
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
}
);

// Expose print-specific APIs
contextBridge.exposeInMainWorld(
    'electronAPI', {
    // Print the current page
    printPage: () => {
        ipcRenderer.send('print-page');
    },
    
    // Export current page to PDF
    exportToPDF: () => {
        ipcRenderer.send('export-to-pdf');
    },
    
    // Open DevTools for current window
    openDevTools: () => {
        ipcRenderer.send('open-devtools');
    },
    
    // Open print preview window
    openPrintPreview: (customerId) => {
        ipcRenderer.send('open-print-preview', { customerId });
    },
    
    // Listen for PDF export response
    onExportPDFResponse: (callback) => {
        ipcRenderer.on('export-pdf-response', (event, response) => {
            callback(response);
        });
    }
});

console.log('Preload script completed - APIs exposed');
