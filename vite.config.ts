import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dtsPlugin from 'vite-plugin-dts'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),dtsPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: "mapleCom",
      formats: ["es", "umd", "cjs"],
    },
    rollupOptions: {
      external: ['vue','elementPlus'],
      output: {
        globals: {
          vue: "Vue",
          elementPlus: "ElementPlus"
        },
        exports: "named",
      }
    }
  }
})
