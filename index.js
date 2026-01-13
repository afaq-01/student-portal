import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import routers from "./Routes/clerkwebhook.js";

import connectDB from "./Config/Config.js";
import router from './Routes/Routes.js';

const app = express();

/* ---------------- MIDDLEWARE ---------------- */



// ⚠️ Webhook FIRST
app.use("/api/webhooks", routers);

// CORS
app.use(
  cors()
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------------- ROUTES ---------------- */

app.use("/api", router);

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed:", error);
    process.exit(1);
  }
};

startServer();
