import mongoose from "mongoose";

/* ---------- Subject ---------- */
const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    marks: { type: Number, default: 0 },
  },
  { _id: false }
);

/* ---------- Semester ---------- */
const semesterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subjects: { type: [subjectSchema], default: [] },
  },
  { _id: false }
);

/* ---------- Student ---------- */
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    rollId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    photo: String,

    fine: {
      type: Number,
      default: 0,
    },

    /* ✅ FIXED: fee as OBJECT */
    fee: {
      type: Map,
      of: Boolean,
      default: {},
    },

    semesters: {
      type: [semesterSchema],
      default: [],
    },

    /* ---------- Clerk ---------- */
    userId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    invitationId: String,

    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
