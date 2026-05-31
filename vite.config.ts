import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // quickjs-emscripten ships a WASM variant; let Vite handle it without
  // pre-bundling so the embedded wasm loads correctly in dev.
  optimizeDeps: {
    exclude: ['quickjs-emscripten'],
  },
})
