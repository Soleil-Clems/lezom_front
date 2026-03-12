import { Tray, Menu, app, nativeImage } from 'electron';
import path from 'path';
import { APP_NAME } from './config';

let tray: Tray | null = null;

export function createTray(getWindow: () => Electron.BrowserWindow | null): void {
  const iconPath = path.join(__dirname, '../assets/icon.png');
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });

  tray = new Tray(icon);
  tray.setToolTip(APP_NAME);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Ouvrir Lezom',
      click: () => {
        const win = getWindow();
        if (win) { win.show(); win.focus(); }
      },
    },
    { type: 'separator' },
    { label: 'Quitter', click: () => { app.quit(); } },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    const win = getWindow();
    if (win) {
      if (win.isVisible()) { win.focus(); } else { win.show(); }
    }
  });
}

export function destroyTray(): void {
  tray?.destroy();
  tray = null;
}
