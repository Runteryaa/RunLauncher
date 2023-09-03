// Access Electron APIs through the window.electron object
const { ipcRenderer, shell } = window.electron;

const progressBar = document.getElementById('progress-bar');

document.getElementById('download-version').addEventListener('click', () => {
    const versionFileSelect = document.getElementById('version');
    const selectedVersionUrl = versionFileSelect.value;

    console.log('Download button clicked');
    console.log('Selected AppX URL:', selectedVersionUrl);

    // Send the selected AppX URL to the main process
    ipcRenderer.send('download-version', selectedVersionUrl);
});

// Listen for download progress updates from the main process using ipcRenderer.invoke
ipcRenderer.invoke('listen-download-progress').then((progress) => {});
