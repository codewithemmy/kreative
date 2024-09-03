const mongoose = require("mongoose")

const approvedResultSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Types.ObjectId, ref: "SchoolClass" },
    schoolTerm: {
      type: String,
      enum: ["first", "second", "third"],
      required: true,
    },
    year: { type: String },
    isApproved: {
      type: Boolean,
    },
  },
  { timestamps: true }
)

const approvedResult = mongoose.model(
  "ApprovedResult",
  approvedResultSchema,
  "approvedResult"
)

module.exports = { ApprovedResult: approvedResult }
