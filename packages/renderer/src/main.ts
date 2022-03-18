import { createApp } from 'vue'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import '~/styles/main.css'
import 'uno.css'

createApp(App)
  .mount('#app')
  .$nextTick(window.removeLoading)

console.log('fs', window.fs)
console.log('ipcRenderer', window.ipcRenderer)

// ipcRenderer.on 的用法
window.ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})
