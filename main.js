const { app, BrowserWindow } = require('electron');

function createMainWindow() {
  let mainWindow = new BrowserWindow({
    title: 'Electron Bookmarks'
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createMainWindow);