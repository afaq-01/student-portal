import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: String,
    marks: Number,
  },
  { _id: false }
);

const semesterSchema = new mongoose.Schema(
  {
    name: String,
    subjects: [subjectSchema],
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    rollId: { type: String, required: true, unique: true },

    photo: String,

    fine: { type: Number, default: 0 },

    fee:Boolean,

    semesters: [semesterSchema],

    // Clerk userId
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
