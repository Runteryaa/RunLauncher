const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const electronDl = require('electron-dl');
const https = require('https');

const downloadsPath = path.join(__dirname, 'downloads');

electronDl();

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 720,
        icon: `${__dirname}/mc.png`,
        webPreferences: {
            devTools: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    win.setMenuBarVisibility(true);

    win.loadFile('launcher/index.html');
}

app.whenReady().then(createWindow);

if (!fs.existsSync(downloadsPath)) {
    fs.mkdirSync(downloadsPath);
}

// Handle progress updates
ipcMain.handle('listen-download-progress', async (event) => {
    // Simulate the progress, you should implement actual progress tracking here
    let progress = 0;
    while (progress < 100) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate some time
        progress += 10; // Simulate progress
        event.sender.send('download-progress', progress);
    }
    return 100; // Return 100% when complete
});

ipcMain.on('download-version', (event, versionUrl) => {
    // Extract the file name from the URL
    const fileName = path.basename(versionUrl);
    const downloadPath = path.join(downloadsPath, fileName);

    // Check if the file already exists in the downloads directory
    if (fs.existsSync(downloadPath)) {
        // If the file exists, open it directly
        shell.openPath(downloadPath);
    } else {
        // If the file doesn't exist, start the download
        event.sender.send('download-progress', 0); // Initialize progress to 0%
        electronDl.download(BrowserWindow.getFocusedWindow(), versionUrl, {
            directory: downloadsPath,
            filename: fileName,
            onProgress: (progress) => {
                event.sender.send('download-progress', progress); // Send progress updates to the renderer process
            },
        })
        .then(dl => {
            // Open the downloaded file when the download is complete
            shell.openPath(dl.getSavePath());
        });
    }
});



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
