import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(process.cwd(), "habits.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/habits", (req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        res.json({ success: true, data: JSON.parse(data) });
      } else {
        res.json({ success: true, data: null }); // Let frontend decide initial data
      }
    } catch (err) {
      console.error("Failed to read habits:", err);
      res.status(500).json({ success: false, error: "Failed to read habits" });
    }
  });

  app.post("/api/habits", (req, res) => {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to write habits:", err);
      res.status(500).json({ success: false, error: "Failed to save habits" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
