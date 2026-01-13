import { clerkClient } from "@clerk/clerk-sdk-node";
import Student from "../Models/Models.js";

/* ================= CREATE STUDENT ================= */


export const addStudent = async (req, res) => {
  try {
    const { name, email, rollId, photo, semesters, fee } = req.body;

    // 1️⃣ Check MongoDB for existing Roll ID
    const existing = await Student.findOne({ rollId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Student with this Roll ID already exists" });
    }

    // 2️⃣ Create Clerk invitation (this SENDS the email)
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      publicMetadata: { role: "student" },
      redirectUrl: "http://localhost:5173/sign-up",
    });

    // 3️⃣ Save student in MongoDB (NO clerkUserId yet)
    const student = await Student.create({
      name,
      email,
      rollId,
      photo,
      semesters,
      fee,
      role: "student",
      invitationId: invitation.id,
    });

    res.status(201).json({
      message: "Student invitation sent successfully",
      student,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Failed to create student" });
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
