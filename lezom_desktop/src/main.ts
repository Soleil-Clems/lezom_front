import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import { getAppUrl, APP_NAME } from './config';
import { createTray, destroyTray } from './tray';
import { registerShortcuts, unregisterShortcuts } from './shortcuts';
import { setupIpcHandlers, removeIpcHandlers } from './ipc-handlers';

let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 940,
    minHeight: 500,
    title: APP_NAME,
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 15, y: 13 },
    backgroundColor: '#2c2d30',
    show: false,
  });

  mainWindow.loadURL(getAppUrl());

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('close', (event) => {
    if (process.platform === 'darwin' && !isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

function initServices(): void {
  createTray(() => mainWindow);
  registerShortcuts(() => mainWindow);
  setupIpcHandlers(() => mainWindow);
}

app.whenReady().then(() => {
  createWindow();
  initServices();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow?.show();
    }
  });
});

app.on('before-quit', () => {
  isQuitting = true;
  removeIpcHandlers();
  unregisterShortcuts();
  destroyTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit(); }
});
