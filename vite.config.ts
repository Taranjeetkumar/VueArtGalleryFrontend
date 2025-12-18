import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: [
      ".ngrok-free.app",      // allow ngrok URLs
      ".trycloudflare.com"    // allow cloudflare tunnel (optional)
    ]
  }
});
