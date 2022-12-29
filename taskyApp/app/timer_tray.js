const electron = require("electron");
const positioner = require("electron-traywindow-positioner");

const { Tray, Menu, app } = electron;

class TimerTray extends Tray {
    constructor(iconPath, mainWindow) {
        super(iconPath);

        this.mainWindow = mainWindow;

        this.setToolTip("Timer App");

        this.on("click", (bounds) => {
            if (this.mainWindow.isVisible()) {
                this.mainWindow.hide();
            } else {
                positioner.position(this.mainWindow, bounds);
                this.mainWindow.show();
            }
        });

        this.on("right-click", () => {
            const menuConfig = Menu.buildFromTemplate([
                {
                    label: "Quit",
                    click: () => app.quit(),
                },
            ]);
            this.popUpContextMenu(menuConfig);
        });
    }
}

module.exports = TimerTray;
