
export { }

declare global {
  interface Window {
    // 通过 preload 暴露的一些API
    fs: typeof import('fs')
    ipcRenderer: import('electron').IpcRenderer
    removeLoading: () => void
  }
}
