const {app, BrowserWindow} = require('electron');
// require('electron-reload')(__dirname);

let appWin = null;
const winConfig = {width: 1200, height: 600};
const path = require('path');
const url = require('url');
require('dotenv').config();
const loadUrl = 'http://localhost:4200';
let jarPid = null;
let child1 = null;

function createWindow() {
  //let exec = require('child_process').exec, child;

  // child = exec('java -jar ../elrond.jar',
  //   function (error, stdout, stderr) {
  //     console.log('stdout: ' + stdout);
  //     console.log('stderr: ' + stderr);
  //     if (error !== null) {
  //       console.log('exec error: ' + error);
  //     }
  //   });
  //
  // child1 = child;

  // App close handler
  app.on('before-quit', function () {
    // child1.kill();
  });

  // Initialize the window to our specified dimensions
  appWin = new BrowserWindow(winConfig);

  appWin.loadURL(loadUrl);

  // appWin.loadURL(url.format({
  //   pathname: path.join(__dirname, 'dist/elrond-ui/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));
  appWin.webContents.openDevTools();

  // Remove window once app is closed
  appWin.on('closed', function () {
    appWin = null;
  });
}

app.on('ready', createWindow);

app.on('activate', () => {
  if (appWin === null) {
    createWindow();
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

