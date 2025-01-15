import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".ts", ".tsx", ".js"], // Make sure these extensions are handled
  },
  build: {
    outDir: "dist", // Ensure build output matches tsconfig.json
    emptyOutDir: true, // Clean the output folder before building
  },
});
