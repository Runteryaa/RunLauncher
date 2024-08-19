  const { app, BrowserWindow, Menu, ipcMain } = require('electron')
  const path = require('path')
  const rpc = require('discord-rpc')
  const electronReload = require('electron-reload')
  const fs = require('fs-extra')

  var isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == 'true') : false;

  if (isDev) {
      require('electron-reload')(__dirname);
  }
  const { version } = require('./package.json');

  var data = {
    "accountname": "",
    "instances": {},
    "settings": {}
  }

  if (isDev) {
    config = fs.readJsonSync(path.join(__dirname, 'config.json'));
    console.log("DEV")
  } else {
    var datasPath = app.getPath('userData')
    var filePath = path.join(datasPath, "config.json")
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    var fileContent = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(fileContent)
    console.log(config)
  }


  const createWindow = () => {
    const win = new BrowserWindow({
      width: 1000,
      height: 600,
      frame: true,
      title: "RunLauncher",
      backgroundColor: '#161616',
      icon: 'icon.png',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
      }    
    })
    win.loadFile('app/app.html');
    if (isDev) {win.webContents.openDevTools()}
    // win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    // win.setAlwaysOnTop(true, 'screen-saver', 1);
  }
  ipcMain.handle('get-config', () => config);
  Menu.setApplicationMenu(null);


  const client = new rpc.Client({transport: "ipc"})
  client.on("ready", () => {
    client.setActivity({
      state: `version: ${version}`,
      startTimestamp: new Date(),
      largeImageKey: "icon",
      largeImageText: "~RunLauncher",
      buttons: [
        { label: "Get RunLauncher", url: "https://github.com/Runteryaa/RunLauncher" }
      ]
    });
    console.log("RPC active");
  });
  client.login({clientId: "1271527756936515700"})


  app.on('ready', () => {
    createWindow()
  })
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
  })
  app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
  })