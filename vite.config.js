// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ command }) => ({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main:    resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'html/contact.html'),
        product: resolve(__dirname, 'html/product.html'),
        about:   resolve(__dirname, 'html/aboutUs.html'),
        productList: resolve(__dirname, 'html/productList.html'),
        login: resolve(__dirname, 'html/login.html'),
      },
    },
  },
}));
