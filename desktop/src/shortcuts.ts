import { globalShortcut, BrowserWindow } from 'electron';

export function registerShortcuts(window: BrowserWindow): void {
  globalShortcut.register('CmdOrCtrl+Shift+L', () => {
    if (window.isVisible()) {
      window.hide();
    } else {
      window.show();
      window.focus();
    }
  });
}

export function unregisterShortcuts(): void {
  globalShortcut.unregisterAll();
}
