import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: ".", // Ensure Vite looks for .env in the root directory

  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
