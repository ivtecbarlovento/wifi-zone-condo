import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,  // Puerto para el servidor de desarrollo
  },
  preview: {
    host: true,
    port: 3000,  // Puerto para el servidor de vista previa
  },
});