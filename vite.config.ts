import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return { plugins: [vue()], server: { port: 5174, strictPort: true, proxy: { '/api': { target: env.API_PROXY_TARGET || 'https://users-management-api-orb0.onrender.com', changeOrigin: true } } } };
});
