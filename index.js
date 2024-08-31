  const { app, BrowserWindow, Menu, ipcMain } = require('electron')
  const path = require('path')
  const rpc = require('discord-rpc')
  const electronReload = require('electron-reload')
  const fs = require('fs-extra')

  const { version } = require('./package.json');
  var isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == 'true') : false;
  if (isDev) {require('electron-reload')(__dirname);}

  var data = {
    "accountname": "",
    "instances": {},
    "settings": {}
  }

  if (isDev) {
    config = fs.readJsonSync(path.join(__dirname, 'config.json'));
    console.log("DEV")
    console.log(config)
  } else {
    var datasPath = app.getPath('userData')
    var filePath = path.join(datasPath, "config.json")
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    var fileContent = fs.readFileSync(filePath, 'utf8');
    config = JSON.parse(fileContent)
    console.log(config)
  }


  const createWindow = () => {
    const win = new BrowserWindow({
      width: 1000,
      height: 600,
      frame: true,
      title: "RunLauncher",
      backgroundColor: '#161616',
      contextIsolation: true,
      icon: 'icon.png',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
      }    
    })
    win.loadFile('app/app.html');
    if (isDev) {
      win.webContents.openDevTools()
    }
    // win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    // win.setAlwaysOnTop(true, 'screen-saver', 1);
  }
  ipcMain.handle('get-config', () => config);
  ipcMain.handle('save-config', async (event, newConfig) => {
    try {
      config = { ...config, ...newConfig };
      if (!isDev) {
        const datasPath = app.getPath('userData');
        const filePath = path.join(datasPath, 'config.json');
        await fs.writeJson(filePath, config, { spaces: 2 });
      }
      return config;
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  });
  
  
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