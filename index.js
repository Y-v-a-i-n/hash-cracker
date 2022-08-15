const {
    app: app,
    BrowserWindow: BrowserWindow
} = require("electron"),
    createWindow = () => {
    let window = new BrowserWindow({
        titleBarStyle: "defaut",
        title: "Hash Cracker",
        frame: !0,
        width: 300,
        height: 470,
        icon: __dirname + "\\img\\img_415228-3269798449.png",
        show: !0,
        resizable: !1,
        autoHideMenuBar: !0,
        webPreferences: {
            nodeIntegration: !0,
            contextIsolation: !1,
            enableRemoteModule: !0
        }
    });
    window.loadFile("src/index.html")
    window.on("closed", (() => {
        window = null
    }))
};
app.on("ready", createWindow), app.on("window-all-closed", (() => {
    if ("darwin" !== process.platform) return app.quit()
})), app.on("activate", (() => {
    if (null === win) return createWindow()
}));