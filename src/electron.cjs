const { app, BrowserWindow } = require('electron');
const path = require('path');
const serve = require('electron-serve');

const loadURL = serve({ directory: '.' });
const isDev = !app.isPackaged || (process.env.NODE_ENV == "development");
let mainView;

function loadVite(port) {
    mainView.loadURL(`http://127.0.0.1:${port}`).catch((err) => {
      setTimeout(() => { loadVite(port); }, 200);
    });
  }

const createView = () => {
    mainView = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, 'public/favicon.png'),
        show: false
    });

    mainView.once("close", () => {
        mainView = null;
    });
    if (isDev) {
        loadVite(3580);
    } else {
        loadURL(mainView);
    }
}

app.on('ready', createView);

app.on("activate", () => {
    if (!mainView) {
        createView();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});