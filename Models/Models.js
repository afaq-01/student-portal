import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: String,
  marks: Number,
});

const semesterSchema = new mongoose.Schema({
  name: String,
  subjects: [subjectSchema],
});

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    rollId: { type: String, required: true, unique: true },

    photo: String,

    fine: { type: Number, default: 0 },

    fee: { type: Number, default: 0 },

    semesters: [semesterSchema],

    // Clerk userId
    userId: { type: String, default: null },

    invitationId: String,

    status: {
      type: String,
      enum: ["pending", "active"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
