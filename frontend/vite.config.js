import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Semantic UI 2.5 trae hacks de CSS que el minificador estricto rechaza.
    cssMinify: false,
  },
  server: {
    port: 5174,
    strictPort: true,
  },
});
