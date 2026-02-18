import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        catalog: resolve(__dirname, 'catalog.html'),
        contacts: resolve(__dirname, 'contacts.html'),
        faq: resolve(__dirname, 'faq.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        product: resolve(__dirname, 'product.html')
      }
    }
  }
});

