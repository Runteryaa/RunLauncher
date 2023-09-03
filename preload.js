const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => {
            ipcRenderer.send(channel, data);
        },
        invoke: (channel, data) => {
            return ipcRenderer.invoke(channel, data);
        },
    },
    shell,
    // You can expose other Electron APIs as needed here
});
