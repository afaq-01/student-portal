import express from "express";
import { Webhook } from "svix";
import Student from "../Models/Models.js";

const routers = express.Router();

routers.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("🔥 CLERK WEBHOOK HIT");

    try {
      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

      const event = wh.verify(req.body, {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });

      const { type, data } = event;
      console.log("📌 Clerk Event:", type);

      // 1️⃣ USER CREATED
      if (type === "user.created") {
        const email = data.email_addresses?.[0]?.email_address;
        if (!email) return res.status(400).json({ message: "Email missing" });

        const student = await Student.findOne({ email });

        if (!student) {
          console.log("⚠️ No student found for:", email);
          return res.status(200).json({ success: true });
        }

        // Idempotency
        if (student.userId) {
          return res.status(200).json({ success: true });
        }

        student.userId = data.id;
        student.status = "active";
        await student.save();

        console.log("✅ Student activated:", student.rollId);
      }

      // 2️⃣ USER UPDATED
      if (type === "user.updated") {
        await Student.findOneAndUpdate(
          { userId: data.id },
          {
            email: data.email_addresses?.[0]?.email_address,
          }
        );
      }

      // 3️⃣ USER DELETED
      if (type === "user.deleted") {
        await Student.findOneAndUpdate(
          { userId: data.id },
          { status: "inactive" } // soft delete (recommended)
        );
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Webhook error:", error.message);
      return res.status(400).json({ message: "Webhook verification failed" });
    }
  }
);

export default routers;
