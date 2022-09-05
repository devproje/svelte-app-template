const { app, BrowserWindow } = require("electron");
const serve = require("electron-serve");
const path = require("path");

const loadURL = serve({ directory: "./build" });
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
        autoHideMenuBar: true,
        icon: path.join(__dirname, "./static/favicon.png"),
        show: false
    });

    mainView.once("close", () => {
        mainView = null;
    });

    if (!isDev) {
        loadURL(mainView);
    } else {
        loadVite(5173);
    }

    mainView.show();
}

app.on("ready", createView);

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