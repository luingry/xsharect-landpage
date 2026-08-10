import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isVercel = process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);

export default defineConfig({
  plugins: [react()],
  base: isVercel ? "/" : "/xsharect-landpage/",
  build: { outDir: "dist", sourcemap: false },
});
