const { app, BrowserWindow, shell } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

if (require('electron-squirrel-startup')) app.quit();

const isDev = !app.isPackaged;
const FRONTEND_URL = 'http://localhost:3000';

let mainWindow;
let nextProcess;

function startNextServer() {
  return new Promise((resolve) => {
    const frontendPath = path.join(process.resourcesPath, 'lezom_front/client');
    console.log('[Lezom] Starting Next.js from:', frontendPath);

    nextProcess = spawn('node_modules/.bin/next', ['start', '-p', '3000'], {
      cwd: frontendPath,
      shell: true,
      env: { ...process.env, NODE_ENV: 'production' },
    });

    nextProcess.stdout.on('data', (data) => {
      const out = data.toString();
      console.log('[Next.js]', out);
      if (out.includes('Ready') || out.includes('started server')) resolve();
    });

    nextProcess.stderr.on('data', (d) => console.error('[Next.js]', d.toString()));
    nextProcess.on('error', () => resolve());
    setTimeout(resolve, 30000);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Lezom',
    backgroundColor: '#1e1f22',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(FRONTEND_URL);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(FRONTEND_URL)) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) mainWindow.webContents.openDevTools();
  });
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(async () => {
  if (!isDev) await startNextServer();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (nextProcess) nextProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (nextProcess) nextProcess.kill();
});
