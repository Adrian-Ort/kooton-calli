// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'html/contact.html'),
        aboutUs: resolve(__dirname, 'html/aboutUs.html'),
        login: resolve(__dirname, 'html/login.html'),
        signup: resolve(__dirname, 'html/signup.html'),
        product: resolve(__dirname, 'html/product.html'),
        productList: resolve(__dirname, 'html/productList.html'),
        shoppingCart: resolve(__dirname, 'html/shoppingCart.html'),
        orderSuccess: resolve(__dirname, 'html/orderSuccess.html'),
        shipping: resolve(__dirname, 'html/shippingForm.html'),
        womenCategory: resolve(__dirname, 'html/womenCategory.html'),
        menCategory: resolve(__dirname, 'html/menCategory.html'),
      },
    },
  },
})