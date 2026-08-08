import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM-safe __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  // Vite build output - matches vite.config.ts outDir: dist/public
  const distPath = path.resolve(process.cwd(), "dist", "public");

  console.log("Looking for dist at:", distPath);
  console.log("Dist exists:", fs.existsSync(distPath));

  if (fs.existsSync(path.resolve(process.cwd(), "dist"))) {
    console.log("Contents of dist:", fs.readdirSync(path.resolve(process.cwd(), "dist")));
  }

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}. Make sure the client is built.`,
    );
  }

  console.log("Contents of dist/public:", fs.readdirSync(distPath));

  // Serve static assets
  app.use(express.static(distPath));

  // SPA fallback (React router, etc.)
  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}