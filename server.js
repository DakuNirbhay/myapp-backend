// server.js (works without installing MongoDB)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path")
const authRoutes = require(path.join(__dirname, "./routes/authRoutes.js"));
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = express();
const PORT = 5000;

// middleware
app.use(cors()); 
app.use(express.json());

// routes
app.use("/api", authRoutes);
// health check route
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// start in-memory MongoDB then start server
async function startServer() {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log("✅ MongoDB Memory Server connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error starting server:", err);
  }
}

startServer();
