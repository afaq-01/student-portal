// api/index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "../Config/Config.js";
import routers from "../Routes/clerkwebhook.js";
import router from "../Routes/Routes.js";

import serverless from "serverless-http"; // Needed to wrap Express

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------------- CORS ---------------- */
const allowedOrigins = [
  "https://student-portal-frontend-mocha.vercel.app",
  "https://student-portal.clerk.accounts.dev" // deployed frontend
];

if (process.env.NODE_ENV === "development") {
  allowedOrigins.push("http://localhost:5173"); // local dev
}

// Universal CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});


/* ---------------- ROUTES ---------------- */
// Clerk webhook FIRST
app.use("/api/webhooks", routers);

// API routes
app.use("/api", router);

/* ---------------- DB CONNECTION ---------------- */
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ---------------- EXPORT FOR VERCEL ---------------- */
export default serverless(app);
