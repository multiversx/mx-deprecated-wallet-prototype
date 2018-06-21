"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var axios = require('axios');
var win, serve;
var args = process.argv.slice(1);
serve = args.some(function (val) { return val === '--serve'; });
var local = args.some(function (val) { return val === '--local'; });
var apiUrl = 'http://localhost:8080/node/';
function startAPI() {
    var exec = require('child_process').exec;
    var jarPath = (process.platform === 'darwin') ? './Contents/elrond-api-1.0-SNAPSHOT.jar' : 'elrond-api-1.0-SNAPSHOT.jar';
    var child = exec('java -jar ' + jarPath, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}
function createWindow() {
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    console.log('ic elctron debug');
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        width: 1200,
        height: 600,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: false
        },
        backgroundColor: '#ffffff',
        show: false
    });
    // if dev
    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/node_modules/electron")
        });
        win.loadURL('http://localhost:4200');
        win.webContents.openDevTools();
        // if prod
    }
    else {
        if (local) {
            win.webContents.openDevTools();
        }
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    // Show win when all is set
    win.once('ready-to-show', function () {
        win.show();
    });
    // Emitted when the window is closed.
    win.on('closed', function () {
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
    electron_1.app.on('ready', createWindow);
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        axios.get(apiUrl + 'exit')
            .then(function (res) { return console.log('axios res: ', res); });
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
