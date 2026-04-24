import { contextBridge, ipcRenderer } from 'electron';
import { NotifyPayload } from './ipc-types';

type NotificationClickHandler = (payload: NotifyPayload) => void;

contextBridge.exposeInMainWorld('lezomDesktop', {
  platform: process.platform,
  isDesktop: true,
  notify: (payload: NotifyPayload) => ipcRenderer.invoke('desktop:notify', payload),
  setBadge: (count: number) => ipcRenderer.send('desktop:set-badge', count),
  focus: () => ipcRenderer.send('desktop:focus'),
  isFocused: (): Promise<boolean> => ipcRenderer.invoke('desktop:is-focused'),
  onNotificationClick: (callback: NotificationClickHandler): (() => void) => {
    const handler = (_event: unknown, payload: NotifyPayload) => callback(payload);
    ipcRenderer.on('desktop:notification-clicked', handler);
    return () => ipcRenderer.removeListener('desktop:notification-clicked', handler);
  },
});
