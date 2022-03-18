import { builtinModules } from 'module'
import path from 'path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import resolve from 'vite-plugin-resolve'
import pkg from '../../package.json'

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV,
  root: __dirname,
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    AutoImport({
      imports: ['vue', 'vue/macros', 'vue-router', '@vueuse/core'],
      dts: true,
    }),
    Components({
      dts: true,
    }),

    /**
     * 可以指定其他模块
     * 🚧 必须确保模块在`dependencies`中，而不是在`devDependencies`,
     * 这将确保electron-builder能够正确地打包它。
     * @example
     * {
     *   'electron-store': 'const Store = require("electron-store"); export default Store;',
     * }
     */
    resolveElectron(),
    Unocss(),
  ],
  base: './',
  build: {
    sourcemap: true,
    outDir: '../../dist/renderer',
  },
  server: {
    port: pkg.env.PORT,
  },
})

/**
 * 为了在渲染进程能使用Electron和NodeJS APIs
 * @see https://github.com/caoxiemeihao/electron-vue-vite/issues/52
 */
export function resolveElectron(
  resolves: Parameters<typeof resolve>[0] = {},
): Plugin {
  const builtins = builtinModules.filter(t => !t.startsWith('_'))

  /**
   * @see https://github.com/caoxiemeihao/vite-plugins/tree/main/packages/resolve#readme
   */
  return resolve({
    electron: electronExport(),
    ...builtinModulesExport(builtins),
    ...resolves,
  })

  function electronExport() {
    return `
/**
 * For all exported modules see https://www.electronjs.org/docs/latest/api/clipboard -> Renderer Process Modules
 */
const electron = require("electron");
const {
  clipboard,
  nativeImage,
  shell,
  contextBridge,
  crashReporter,
  ipcRenderer,
  webFrame,
  desktopCapturer,
  deprecate,
} = electron;

export {
  electron as default,
  clipboard,
  nativeImage,
  shell,
  contextBridge,
  crashReporter,
  ipcRenderer,
  webFrame,
  desktopCapturer,
  deprecate,
}
`
  }

  function builtinModulesExport(modules: string[]) {
    return modules
      .map((moduleId) => {
        const nodeModule = require(moduleId)
        const requireModule = `const M = require("${moduleId}");`
        const exportDefault = 'export default M;'
        const exportMembers = `${Object.keys(nodeModule)
          .map(attr => `export const ${attr} = M.${attr}`)
          .join(';\n')};`
        const nodeModuleCode = `
${requireModule}

${exportDefault}

${exportMembers}
`

        return { [moduleId]: nodeModuleCode }
      })
      .reduce((memo, item) => Object.assign(memo, item), {})
  }
}
