const { app, BrowserWindow } = require('electron');
const path = require('path');
const serve = require('electron-serve');

const loadURL = serve({ directory: 'public' });

function isDev() {
    return !app.isPackaged;
}

const createWindow = () => {
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.ts'),
        },
        icon: path.join(__dirname, 'public/favicon.png'),
        show: false
    });

    if (isDev()) {
        mainWindow.loadURL("http://localhost:1238/");
    } else {
        loadURL(mainWindow);
    }
    
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });
}

app.on('ready', createWindow);