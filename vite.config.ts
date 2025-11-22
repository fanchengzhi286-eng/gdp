import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // Polyfill process.env.API_KEY so it works in the browser
    // We default to '' if undefined to prevent JSON.stringify(undefined) errors
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    },
    build: {
      rollupOptions: {
        // These libraries will not be bundled. They must be present in the import map in index.html
        external: [
          'react',
          'react-dom',
          'react-globe.gl',
          'three',
          '@google/genai',
          'recharts',
          'react-markdown',
          'lucide-react'
        ],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            three: 'THREE',
          }
        }
      }
    }
  };
});