import { release } from 'os'
import { join } from 'path'
import { BrowserWindow, app, shell } from 'electron'

// 禁用Windows 7的GPU加速功能
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// 设置Windows 10+通知的应用程序名称
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 900,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
    },
  })

  if (app.isPackaged || process.env.DEBUG) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

    win.loadURL(url)
    // win.webContents.openDevTools()
  }

  // 测试主动推送信息给Renderer-process
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // 使所有的链接通过浏览器打开，而不是通过应用程序打开
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // 如果用户试图打开另一个窗口，则聚焦于主窗口
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) allWindows[0].focus()
  else createWindow()
})
