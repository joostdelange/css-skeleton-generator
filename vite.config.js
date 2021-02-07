import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default {
  plugins: [vue()],
  server: { port: 8080 },
  alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
};
