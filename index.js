// api/index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "../Config/Config.js";
import clerkWebhooks from "../Routes/clerkwebhook.js";
import apiRoutes from "../Routes/Routes.js";
import serverless from "serverless-http";

const app = express();

/* ---------------- BASIC MIDDLEWARE ---------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------------- CORS CONFIG ---------------- */
const allowedOrigins = [
  "https://student-portal-frontend-mocha.vercel.app", // deployed frontend
  "https://student-portal.clerk.accounts.dev",        // Clerk DEV domain
];

if (process.env.NODE_ENV === "development") {
  allowedOrigins.push("http://localhost:5173"); // local frontend
}

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, webhooks)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight support
app.options("*", cors());

/* ---------------- ROUTES ---------------- */
// Clerk webhooks FIRST
app.use("/api/webhooks", clerkWebhooks);

// API routes
app.use("/api", apiRoutes);

/* ---------------- DB ---------------- */
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ---------------- EXPORT (VERCEL) ---------------- */
export default serverless(app);
