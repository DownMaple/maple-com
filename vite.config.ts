import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dtsPlugin from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dtsPlugin({
      cleanVueFileName: true,
      skipDiagnostics: true,
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outDir: 'dist'
    })
  ],
  build: {
    emptyOutDir: true, // 清空输出目录
    minify: 'terser',
    sourcemap: false,
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: "mapleCom",
      fileName: 'maple-com', // 统一文件名
      formats: ["es"] // 只保留ES模块
    },
    rollupOptions: {
      external: [
        'vue', 
        'element-plus', 
        '@element-plus/icons-vue', 
        '@wangeditor/editor-for-vue'
      ],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // 压缩配置
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        },
        globals: {
          vue: "Vue",
          elementPlus: "ElementPlus"
        },
        exports: "named"
      }
    }
  }
})
