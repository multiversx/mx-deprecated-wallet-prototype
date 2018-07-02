import { app, BrowserWindow, screen, Menu } from 'electron';
import * as path from 'path';
import * as url from 'url';

const axios = require('axios');

let win;
let serve;
let splashWindow;
const apiUrl = 'http://localhost:8080/node/';
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');
const local = args.some(val => val === '--local');

function startAPI() {
  const exec = require('child_process').exec;
  const jarPath = (process.platform === 'darwin') ? './Contents/elrond-api-1.0-SNAPSHOT.jar' : 'elrond-api-1.0-SNAPSHOT.jar';

  const child = exec('java -jar ' + jarPath,
    function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);

      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
}

function createWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;


  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
    },
    backgroundColor: '#ffffff',
    show: false
  });

  splashWindow = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true
  });

  splashWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'splash.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Create the Application's main menu
  const template = [
    {
      label: 'Edit',
      submenu: [
        {label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:'},
        {label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:'},
        {label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:'},
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // if dev
  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
    // if prod
  } else {
    if (local) {
      win.webContents.openDevTools();
    }

    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // splashWindow.loadURL(`file://${__dirname}/splash.html`);

  // Show win when all is set
  win.once('ready-to-show', () => {
    setTimeout(() => {
      splashWindow.destroy();
      win.show();
    }, 1000);
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  // startAPI();
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.

  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    axios.get(apiUrl + 'exit')
      .then(res => console.log('axios res: ', res));

    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
