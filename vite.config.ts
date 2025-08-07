/// <reference types="vitest" />
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@features': path.resolve(__dirname, './src/features'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库分离到单独的 chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI 组件库分离
          'ui-vendor': [
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-switch',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-popover',
          ],
          // 表单和验证库分离
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // 国际化库分离
          'i18n-vendor': ['react-i18next', 'i18next'],
          // 数据获取库分离
          'data-vendor': ['swr'],
          // 图标库分离
          'icon-vendor': ['lucide-react'],
        },
      },
    },
    // 调整包大小警告限制到 1MB
    chunkSizeWarningLimit: 1000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
