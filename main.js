const {app, BrowserWindow} = require('electron');
require('electron-reload')(__dirname);

let appWin = null;
const winConfig = {width: 1024, height: 600};
const path = require('path');
const url = require('url');
require('dotenv').config();

app.on('ready', function () {

  // Initialize the window to our specified dimensions
  appWin = new BrowserWindow(winConfig);

  // Specify entry point
  if (process.env.PACKAGE === 'true') {
    appWin.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  } else {
    appWin.loadURL(process.env.HOST);
    appWin.webContents.openDevTools();
  }

  // Remove window once app is closed
  appWin.on('closed', function () {
    appWin = null;
  });

});

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
