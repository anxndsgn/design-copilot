import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./ui-src",
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./ui-src"),
    },
  },
  build: {
    target: "esnext",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: "../dist",
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
