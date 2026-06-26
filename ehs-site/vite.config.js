import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three')) return 'three';
          if (id.includes('recharts')) return 'charts';
          if (id.includes('framer-motion') || id.includes('gsap')) return 'motion';
        },
      },
    },
  },
})
