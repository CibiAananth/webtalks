import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { addLiveReload } from "./utils/client"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), addLiveReload()],
  build: {
    rollupOptions: {
      input: {
        popup: '/src/popup/index.html',
        content: '/src/content-script/index.ts',
        background: '/src/background/index.ts',
      },
      output: {
        entryFileNames(chunkInfo) {
          if (chunkInfo.name === "content") return "content.js";
          return `${chunkInfo.name}.js`
        },
      }
    },
  },
})
