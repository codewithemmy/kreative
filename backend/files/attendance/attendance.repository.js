const { Attendance } = require("./attendance.model")
const mongoose = require("mongoose")

class AttendanceRepository {
  static async create(payload) {
    return Attendance.create(payload)
  }

  static async findAttendanceWithParams(payload, select) {
    return Attendance.find({ ...payload }).select(select)
  }

  static async findSingleAttendanceWithParams(payload, select) {
    const attendance = Attendance.findOne({ ...payload }).select(select)

    return attendance
  }

  static async validateAttendance(payload) {
    return Attendance.exists({ ...payload })
  }

  static async findAllAttendanceParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const attendance = Attendance.find({
      ...restOfPayload,
    })
      .populate({ path: "studentId", select: "name profileImage" })
      .populate({ path: "teacherId", select: "name profileImage" })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return attendance
  }

  static async updateAttendanceDetails(id, params) {
    return Attendance.findOneAndUpdate(
      { ...id },
      { ...params } //returns details about the update
    )
  }

  static async deleteAttendanceId(id) {
    return Attendance.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) })
  }
}

module.exports = { AttendanceRepository }
