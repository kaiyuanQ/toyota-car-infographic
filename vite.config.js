import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: '3000'
},
plugins: [svelte()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Prevent vendor.js being created
        manualChunks: undefined,
        // chunkFileNames: "zzz-[name].js",
        // this got rid of the hash on style.css
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      },
    },
    // Prevent vendor.css being created
    cssCodeSplit: false,
    // prevent some warnings
    chunkSizeWarningLimit: 60000,
  },
  publicDir: 'public'
})
