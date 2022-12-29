const electron = require("electron");
const TimerTray = require("./app/timer_tray");
const path = require("path");
const { app, BrowserWindow, Tray } = electron;

let mainWindow;
let mainTray;

app.on("ready", () => {
    const iconName =
        process.platform === "darwin" ? "windows-icon.png" : "iconTemplate.png";

    const iconPath = path.join(__dirname, `./src/assets/${iconName}`);

    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        height: 500,
        width: 300,
        frame: false,
        resizable: false,
        fullscreenable: false,
        minimizable: false,
        movable: false,
        show: false,
        skipTaskbar: true,
        // icon: iconPath,
    });

    mainWindow.loadFile(`${__dirname}/src/index.html`);
    mainWindow.on("blur", () => {
        mainWindow.hide();
    });

    mainTray = new TimerTray(iconPath, mainWindow); //if reference is not given it will be garbage collected
});
