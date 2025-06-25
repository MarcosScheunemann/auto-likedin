import { app, BrowserWindow } from 'electron';
import * as path from 'path';

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const devUrl = 'http://localhost:8100';
  await win.loadURL(devUrl);
}

app.whenReady().then(createWindow);
