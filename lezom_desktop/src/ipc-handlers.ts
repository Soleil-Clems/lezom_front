import { ipcMain, BrowserWindow, Notification, app } from 'electron';
import { IPC } from './ipc-channels';

export function setupIpcHandlers(getWindow: () => BrowserWindow | null): void {
  ipcMain.on(IPC.WINDOW_MINIMIZE, () => {
    getWindow()?.minimize();
  });

  ipcMain.on(IPC.WINDOW_MAXIMIZE, () => {
    const win = getWindow();
    if (!win) return;
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on(IPC.WINDOW_CLOSE, () => {
    getWindow()?.close();
  });

  ipcMain.on(IPC.NOTIFICATION_SEND, (_event, { title, body }: { title: string; body: string }) => {
    if (Notification.isSupported()) {
      new Notification({ title, body }).show();
    }
  });

  ipcMain.on(IPC.APP_SET_BADGE, (_event, count: number) => {
    if (process.platform === 'darwin') {
      app.setBadgeCount(count);
    }
  });
}

export function removeIpcHandlers(): void {
  Object.values(IPC).forEach((channel) => {
    ipcMain.removeAllListeners(channel);
  });
}
