const {app, BrowserWindow} = require('electron');

let appWin = null;
const winConfig = {width: 1024, height: 600};
const loadUrl = 'http://localhost:4200';

app.on('ready', function () {

  // Initialize the window to our specified dimensions
  appWin = new BrowserWindow(winConfig);

  // Specify entry point
  appWin.loadURL(loadUrl);

  // Show dev tools
  // TODO: Remove this line before distributing
  appWin.webContents.openDevTools();

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
