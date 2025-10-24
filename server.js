// server.js

require("dotenv").config(); // Loads .env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// import routes
const authRoutes = require(path.join(__dirname, "./routes/authRoutes.js"));

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api", authRoutes);

// health check route
app.get("/health", (_req, res) => res.json({ ok: true }));

// connect to MongoDB and start the server
(async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/uon-event";

    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected:", mongoURI);

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
})();
