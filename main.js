const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#f5f6f8',
    icon: path.join(__dirname, 'assets', 'swadistha-app-icon.jpg'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, 'index.html'));

  // Load the Reports reprint helper into the renderer after the POS UI is ready.
  // Keeping this in the Electron main process means the helper works even though
  // index.html is intentionally kept self-contained and nodeIntegration is off.
  win.webContents.on('did-finish-load', () => {
    try {
      const reprintScript = fs.readFileSync(
        path.join(__dirname, 'report-reprint.js'),
        'utf8'
      );
      win.webContents.executeJavaScript(reprintScript);
    } catch (err) {
      console.error('Could not load report reprint helper:', err);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
