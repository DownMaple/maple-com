import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import dtsPlugin from 'vite-plugin-dts'
import vueJsxPlugin from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [
    vue(),
    vueJsxPlugin(),
    dtsPlugin({
      cleanVueFileName: true,
      include: ['src/**/*.ts', 'src/**/*.vue', 'src/**/*.tsx', 'src/**/*.jsx'],
      outDir: 'dist'
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
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
        globals: {
          vue: "Vue",
          elementPlus: "ElementPlus"
        },
        exports: "named"
      }
    }
  },
  server: {
    port: 3303
  }
})
