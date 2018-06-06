const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

// require('dotenv').config({path: path.join(__dirname, '.env')});

let appWin = null;
const winConfig = {width: 1200, height: 600};

function createWindow() {
  appWin = new BrowserWindow(winConfig);

  // // Specify entry point
  // if (process.env.PACKAGE === 'true') {
  //   appWin.loadURL(url.format({
  //     pathname: path.join(__dirname, 'dist/index.html'),
  //     protocol: 'file:',
  //     slashes: true
  //   }));
  // } else {
  //   appWin.loadURL(loadUrl);
  //   appWin.webContents.openDevTools();
  // }

  appWin.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/elrond-ui/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  appWin.webContents.openDevTools();

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
