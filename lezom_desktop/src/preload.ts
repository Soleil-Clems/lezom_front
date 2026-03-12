import { contextBridge, ipcRenderer } from 'electron';
import { IPC } from './ipc-channels';

contextBridge.exposeInMainWorld('lezomDesktop', {
  platform: process.platform,
  isDesktop: true,
  sendNotification: (title: string, body: string) =>
    ipcRenderer.send(IPC.NOTIFICATION_SEND, { title, body }),
  minimize: () => ipcRenderer.send(IPC.WINDOW_MINIMIZE),
  maximize: () => ipcRenderer.send(IPC.WINDOW_MAXIMIZE),
  close: () => ipcRenderer.send(IPC.WINDOW_CLOSE),
  setBadgeCount: (count: number) => ipcRenderer.send(IPC.APP_SET_BADGE, count),
});
