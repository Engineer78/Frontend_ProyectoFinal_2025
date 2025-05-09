import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    mimeTypes: {
      '.jsx': 'text/javascript', // Asegura que los archivos .jsx se sirvan correctamente
    },
  },
});

