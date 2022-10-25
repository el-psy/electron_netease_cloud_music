var import_electron = require("electron");
import_electron.app.whenReady().then(() => {
  const win = new import_electron.BrowserWindow();
  if (import_electron.app.isPackaged) {
    win.loadFile("../dist/index.html");
  } else {
    win.loadURL(process.env.VITE_DEEV_SERVER_URL);
  }
});
