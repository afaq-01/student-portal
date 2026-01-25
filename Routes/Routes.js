import express from "express";
import { addStudent, getStudents } from "../Controllars/Controllars.js";
import requireAuth from "../Middleware/requireAuth.js";
import isAdmin from "../Middleware/isAdmin.js";

const router = express.Router();

// Allow preflight
router.options("/admin/create-student", (req, res) => {
    res.sendStatus(200);
});

// Admin-only route to create student
router.post("/admin/create-student", isAdmin, addStudent);

// Optional: get all students (protected route)
router.get("/students", requireAuth, getStudents);

export default router;
