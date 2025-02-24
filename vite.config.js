import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@react-pdf/renderer": path.resolve(
        __dirname,
        "node_modules/@react-pdf/renderer"
      ),
    },
  },
  optimizeDeps: {
    include: ["@react-pdf/renderer"],
  },
});
