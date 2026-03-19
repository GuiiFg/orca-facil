import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'node:path'
const squirrelStartup = require('electron-squirrel-startup')
import './main/db/icpHandlers/index.js'
import fs from 'fs'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (squirrelStartup) {
  app.quit()
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '../../src/assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    )
  }

  // mainWindow.webContents.openDevTools()
}

/**
 * ✅ HANDLER PARA SELEÇÃO DE ARQUIVO
 */
ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Imagens', extensions: ['png', 'jpg', 'jpeg', 'webp'] }
    ]
  })

  if (result.canceled) return null
  return result.filePaths[0] // caminho real 🔥
})

ipcMain.handle('file-to-base64', async (_, filePath) => {
  const ext = path.extname(filePath).slice(1) || 'png'
  const buffer = fs.readFileSync(filePath)
  const base64 = buffer.toString('base64')

  return `data:image/${ext};base64,${base64}`
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

ipcMain.handle('save-pdf', async (_e, buffer) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Salvar PDF',
    defaultPath: 'orcamento.pdf',
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  })

  if (!canceled && filePath) {
    fs.writeFileSync(filePath, Buffer.from(buffer))
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
