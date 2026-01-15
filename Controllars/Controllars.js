import { clerkClient } from "@clerk/clerk-sdk-node";
import Student from "../Models/Models.js";

/* ================= CREATE STUDENT ================= */

export const addStudent = async (req, res) => {
  try {
    const { name, email, rollId, photo, semesters, fee } = req.body;

    /* ---------- Basic Validation ---------- */
    if (!name || !email || !rollId) {
      return res.status(400).json({
        message: "Name, email, and rollId are required",
      });
    }

    if (!Array.isArray(semesters)) {
      return res.status(400).json({
        message: "Invalid semesters data",
      });
    }

    /* ---------- Duplicate Check (MongoDB) ---------- */
    const existing = await Student.findOne({
      $or: [{ email }, { rollId }],
    });

    if (existing) {
      return res.status(409).json({
        message: "Student with this email or rollId already exists",
      });
    }

    /* ---------- Clerk Invitation ---------- */
    let invitation;
    try {
      invitation = await clerkClient.invitations.createInvitation({
        emailAddress: email,
        publicMetadata: { role: "student" },
        redirectUrl: "http://localhost:5173/sign-up",
      });
    } catch (clerkError) {
      console.error("Clerk Invitation Error:", clerkError);
      return res.status(400).json({
        message: "Failed to send invitation email",
      });
    }

    /* ---------- Create Student ---------- */
    const student = await Student.create({
      name,
      email,
      rollId,
      photo: photo || null,
      fee: fee || {},
      semesters: semesters.map((sem) => ({
        name: sem.name,
        subjects: Array.isArray(sem.subjects) ? sem.subjects : [],
      })),
      role: "student",
      invitationId: invitation.id,
      status: "pending",
    });

    return res.status(201).json({
      message: "Student invitation sent successfully",
      student,
    });
  } catch (error) {
    console.error("ADD STUDENT ERROR:", error);

    /* ---------- Duplicate Key Safety ---------- */
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or Roll ID already exists",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



/* ================= GET ALL STUDENTS ================= */
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};
