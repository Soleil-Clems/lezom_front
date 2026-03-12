import { globalShortcut } from 'electron';

export function registerShortcuts(getWindow: () => Electron.BrowserWindow | null): void {
  globalShortcut.register('CommandOrControl+Shift+L', () => {
    const win = getWindow();
    if (!win) return;
    if (win.isVisible()) { win.hide(); } else { win.show(); win.focus(); }
  });
}

export function unregisterShortcuts(): void {
  globalShortcut.unregisterAll();
}
