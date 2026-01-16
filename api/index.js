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
app.use(
  cors({
    origin: [
  
      "https://student-portal-frontend-mocha.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // if you use cookies/auth headers
  })
);

// 🔥 Handle preflight requests explicitly
app.options("*", cors());

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
