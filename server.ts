import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/status", (req, res) => {
    res.json({ 
      status: "online", 
      system: "CST Dashboard Backend", 
      version: "2.0.0",
      timestamp: new Date().toISOString()
    });
  });

  // Handover Portal View
  app.get("/handover", (req, res) => {
    res.sendFile(path.join(process.cwd(), "HANDOVER_PORTAL.html"));
  });

  // Sample API for stats (to show how backend can interact)
  app.get("/api/health", (req, res) => {
    res.json({ message: "Backend is operational" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
