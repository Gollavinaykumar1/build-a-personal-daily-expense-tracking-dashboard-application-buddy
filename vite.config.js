import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/build-a-personal-daily-expense-tracking-dashboard-application-buddy/",
  build: { outDir: "dist", assetsDir: "assets" },
  server: { port: 3000 },
});
