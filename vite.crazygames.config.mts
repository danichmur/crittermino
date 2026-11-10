import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const fromRoot = (path: string): string => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  root: fromRoot('./crazygames'),
  base: './',
  publicDir: false,
  plugins: [react(), tailwindcss()],
  css: { postcss: { plugins: [] } },
  resolve: {
    alias: [
      { find: /^next\/link$/, replacement: fromRoot('./crazygames/shims/next-link.tsx') },
      { find: /^next\/navigation$/, replacement: fromRoot('./crazygames/shims/next-navigation.ts') },
      { find: /^@\//, replacement: fromRoot('./') },
    ],
  },
  define: {
    'process.env.NEXT_PUBLIC_BUILD_TARGET': JSON.stringify('crazygames'),
  },
  build: {
    outDir: fromRoot('./dist/crazygames'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      onwarn: (warning, warn) => {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      },
    },
  },
})
