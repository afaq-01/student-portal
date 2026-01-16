import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import routers from "../Routes/clerkwebhook.js";
import connectDB from "../Config/Config.js";
import router from "../Routes/Routes.js";

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------------- CORS ---------------- */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        origin === "http://localhost:5173" ||
        origin === "https://student-portal-frontend-mocha.vercel.app" ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 REQUIRED for preflight (VERY IMPORTANT)
app.options("*", cors());

/* ---------------- ROUTES ---------------- */
// Clerk webhook FIRST
app.use("/api/webhooks", routers);

// API routes
app.use("/api", router);

/* ---------------- DB ---------------- */
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ---------------- EXPORT FOR VERCEL ---------------- */
export default app;
