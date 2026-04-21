import { Tray, Menu, BrowserWindow, nativeImage } from 'electron';
import path from 'path';

let tray: Tray | null = null;

export function createTray(window: BrowserWindow): void {
  try {
    const icon = nativeImage.createFromPath(
      path.join(__dirname, '../assets/tray-icon.png')
    );

    tray = new Tray(icon.resize({ width: 16, height: 16 }));

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Ouvrir Lezom',
        click: () => {
          window.show();
          window.focus();
        },
      },
      { type: 'separator' },
      {
        label: 'Quitter',
        click: () => {
          window.destroy();
        },
      },
    ]);

    tray.setToolTip('Lezom');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
      window.show();
      window.focus();
    });
  } catch (err) {
    console.error('Failed to create tray:', err);
  }
}

export function destroyTray(): void {
  tray?.destroy();
  tray = null;
}
