import express from "express";
import { addStudent, getStudents } from "../Controllars/Controllars.js";
import requireAuth from "../Middleware/requireAuth.js";
import isAdmin from "../Middleware/isAdmin.js";

const router = express.Router();

// Admin-only route to create student
router.post("/admin/create-student", requireAuth, isAdmin, addStudent);

// Optional: get all students (protected route)
router.get("/students", requireAuth, getStudents);

export default router;
