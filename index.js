import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import routers from "./Routes/clerkwebhook.js";
import connectDB from "./Config/Config.js";
import router from './Routes/Routes.js';

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // your React dev server
  "https://student-portal-five-drab.vercel.app" // your deployed frontend
];

app.use(
  cors({
    origin: function(origin, callback){
      // allow requests with no origin like Postman
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        const msg = `CORS policy: The origin ${origin} is not allowed.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true // only if you use cookies
  })
);

// ⚠️ Webhook FIRST
app.use("/api/webhooks", routers);

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
