const mongoose = require("mongoose")

const timeTableSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Types.ObjectId, ref: "SchoolClass" },
    period: [
      {
        day: {
          type: String,
          enum: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        },
        type: { type: String },
        startTime: { type: String },
        endTime: { type: String },
        subject: { type: String },
      },
    ],
  },
  { timestamps: true }
)

const timeTable = mongoose.model("TimeTable", timeTableSchema, "timeTable")

module.exports = { TimeTable: timeTable }
