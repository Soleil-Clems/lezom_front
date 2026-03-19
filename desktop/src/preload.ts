import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('lezomDesktop', {
  platform: process.platform,
  isDesktop: true,
});
