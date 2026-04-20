import { app, BrowserWindow, shell, ipcMain, Notification } from 'electron';
import path from 'path';
import { createTray, destroyTray } from './tray';
import { registerShortcuts, unregisterShortcuts } from './shortcuts';
import { NotifyPayload } from './ipc-types';

const activeNotifications = new Map<string, Notification>();

function focusMainWindow(): void {
  if (!mainWindow) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

const APP_URL = process.env.LEZOM_DEV_URL || 'http://localhost:3000';
const APP_NAME = 'Lezom';

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

  mainWindow.loadURL(APP_URL);

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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function registerIpcHandlers(): void {
  ipcMain.handle('desktop:notify', (_event, payload: NotifyPayload) => {
    if (!Notification.isSupported()) return;

    if (payload.tag && activeNotifications.has(payload.tag)) {
      activeNotifications.get(payload.tag)?.close();
    }

    const notif = new Notification({
      title: payload.title,
      body: payload.body,
      silent: false,
    });

    notif.on('click', () => {
      focusMainWindow();
      mainWindow?.webContents.send('desktop:notification-clicked', payload);
    });

    notif.on('close', () => {
      if (payload.tag) activeNotifications.delete(payload.tag);
    });

    if (payload.tag) activeNotifications.set(payload.tag, notif);
    notif.show();
  });

  ipcMain.on('desktop:set-badge', (_event, count: number) => {
    app.setBadgeCount(Math.max(0, count));
  });

  ipcMain.on('desktop:focus', () => {
    focusMainWindow();
  });

  ipcMain.handle('desktop:is-focused', () => {
    return mainWindow?.isFocused() ?? false;
  });
}

app.whenReady().then(() => {
  createWindow();
  registerIpcHandlers();

  if (mainWindow) {
    createTray(mainWindow);
    registerShortcuts(mainWindow);
  }

  app.on('activate', () => {
    if (mainWindow) {
      mainWindow.show();
    } else {
      createWindow();
      if (mainWindow) {
        createTray(mainWindow);
        registerShortcuts(mainWindow);
      }
    }
  });
});

app.on('before-quit', () => {
  isQuitting = true;
  unregisterShortcuts();
  destroyTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
