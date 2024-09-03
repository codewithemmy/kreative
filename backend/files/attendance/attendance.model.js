const mongoose = require("mongoose")

const attendanceSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Types.ObjectId, ref: "SchoolClass" },
    branchId: { type: mongoose.Types.ObjectId, ref: "Branch" },
    studentId: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
    teacherId: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    type: { type: String, required: true, enum: ["teacher", "student"] },
  },
  { timestamps: true }
)

const attendance = mongoose.model("Attendance", attendanceSchema, "attendance")
module.exports = { Attendance: attendance }
