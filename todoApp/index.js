const electron = require("electron");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on("closed", () => app.quit()); //to close whole application, i.e to exit electron

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width: 500,
        height: 400,
        title: "Add New ToDo",
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on("close", () => (addWindow = null)); //for garbage collection
}

ipcMain.on("todo:add", (event, todo) => {
    mainWindow.webContents.send("todo:add", todo);
    addWindow.close(); //garbage collection not performed ()
    // addWindow = null; //for garbage collection , we are now no longer holding reference, we get back the space occupied
});

const menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "New Todo",
                accelerator:
                    process.platform === "darwin"
                        ? "Command+Shift+A"
                        : "Ctrl+Shift+A",
                click() {
                    createAddWindow();
                },
            },
            {
                label: "Clear ToDos",
                accelerator:
                    process.platform === "darwin"
                        ? "Command+Shift+C"
                        : "Ctrl+Shift+C",
                click() {
                    mainWindow.webContents.send("todo:clear", "");
                },
            },
            {
                label: "Quit",
                accelerator:
                    process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
                click() {
                    app.quit();
                },
            },
        ],
    },
];

if (process.platform === "darwin") {
    menuTemplate.unshift({});
}

//to check production environment
//"production", "development", "staging", "test"
if (process.env.NODE_ENV !== "production") {
    menuTemplate.push({
        label: "View",
        submenu: [
            {
                label: "Toggle Developer Tools",
                accelerator:
                    process.platform === "darwin"
                        ? "Command+Alt+i"
                        : "Ctrl+Shift+i",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                },
            },
        ],
    });
}
