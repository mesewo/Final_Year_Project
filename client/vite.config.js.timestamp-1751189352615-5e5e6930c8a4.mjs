// vite.config.js
import path from "path";
import { defineConfig, loadEnv } from "file:///E:/final2/Final_Year_Project/client/node_modules/vite/dist/node/index.js";
import react from "file:///E:/final2/Final_Year_Project/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "E:\\final2\\Final_Year_Project\\client";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __vite_injected_original_dirname, "");
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL, // Use the env variable here
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
