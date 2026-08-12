import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
const projectRoot = fs.realpathSync.native(__dirname);
const reactPath = path.resolve(projectRoot, "node_modules/react");
const reactDomPath = path.resolve(projectRoot, "node_modules/react-dom");
const reactRouterPath = path.resolve(projectRoot, "node_modules/react-router");
const reactRouterDomPath = path.resolve(projectRoot, "node_modules/react-router-dom");
const reactQueryPath = path.resolve(projectRoot, "node_modules/@tanstack/react-query");
const queryCorePath = path.resolve(projectRoot, "node_modules/@tanstack/query-core");

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "react-router",
      "react-router-dom",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(projectRoot, "src"),
      react: reactPath,
      "react-dom": reactDomPath,
      "react-router": reactRouterPath,
      "react-router-dom": reactRouterDomPath,
      "@tanstack/react-query": path.resolve(reactQueryPath, "build/modern/index.js"),
      "@tanstack/query-core": path.resolve(queryCorePath, "build/modern/index.js"),
      "react-dom/client": path.resolve(reactDomPath, "client.js"),
      "react/jsx-runtime": path.resolve(reactPath, "jsx-runtime.js"),
      "react/jsx-dev-runtime": path.resolve(reactPath, "jsx-dev-runtime.js"),
    },
  },
}));
