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
            'logout'
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
            'get-customer-response'
        ];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender` 
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
}
);
