import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    include: [/\.tsx?$/],
  })],
  server: {
    host: true,
    port: 3000,
  proxy: {
    "/backend": {
      target: "http://127.0.0.1:8000",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/backend/, "")
    }
  }
}
})
