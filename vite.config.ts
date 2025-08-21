import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? './' : '/',
  server: {
    host: "::",
    port: 8080,
    // allow setting HMR host for tunneling (e.g. ngrok) via NGROK_HOST env var
    hmr: {
      host: process.env.NGROK_HOST || undefined,
    },
  },
  // when using `vite preview` behind a tunnel (ngrok) the Host header must be allowed
  preview: {
    allowedHosts: process.env.VITE_ALLOWED_HOSTS
      ? process.env.VITE_ALLOWED_HOSTS.split(',').map(s => s.trim())
      : [],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
