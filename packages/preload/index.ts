import fs from 'fs'
import { contextBridge, ipcRenderer } from 'electron'
import { domReady } from './utils'
import { useLoading } from './loading'

const { appendLoading, removeLoading } = useLoading()

;(async() => {
  await domReady()

  appendLoading()
})()

// --------- 向渲染进程暴露一些API. ---------
contextBridge.exposeInMainWorld('fs', fs)
contextBridge.exposeInMainWorld('removeLoading', removeLoading)
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))

// `exposeInMainWorld`不能检测`prototype`的属性和方法，手动打补丁
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj)

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue

    if (typeof value === 'function') {
      // 一些本地API，如`NodeJS.EventEmitter['on']`，在渲染进程中不起作用。把它们包装成一个函数。
      obj[key] = function(...args: any) {
        return value.call(obj, ...args)
      }
    } else {
      obj[key] = value
    }
  }
  return obj
}
