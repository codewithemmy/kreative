const { default: mongoose } = require("mongoose")
const { queryConstructor } = require("../../utils")
const {
  AttendanceSuccess,
  AttendanceFailure,
} = require("./attendance.messages")
const { AttendanceRepository } = require("./attendance.repository")

class AttendanceService {
  static async create(payload) {
    const { branchId, type, classId } = payload

    if (!branchId || !type) {
      return {
        success: false,
        msg: `Branch or type cannot be null`,
      }
    }
    const attendance = await AttendanceRepository.create({
      branchId: new mongoose.Types.ObjectId(branchId),
      classId: new mongoose.Types.ObjectId(classId),
      teacherId: payload.teacherId ? [...payload.teacherId] : [],
      studentId: payload.studentId ? [...payload.studentId] : [],
      type,
    })
    if (!attendance._id) {
      return { success: false, msg: AttendanceFailure.CREATE }
    }
    return {
      success: true,
      msg: AttendanceSuccess.CREATE,
      _id: attendance._id,
    }
  }

  static async getAttendance(payload) {
    let { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Attendance"
    )
    if (error) return { success: false, msg: error }

    const { period } = params
    let extra = {}

    // Initialize daysAgo and calculate the date range
    let daysAgo
    if (period) {
      switch (period) {
        case "day":
          daysAgo = 1
          delete params.period
          break
        case "week":
          daysAgo = 7
          delete params.period
          break
        case "month":
          daysAgo = 30
          delete params.period
          break
        default:
          return {
            success: false,
            msg: "Invalid period specified. Use 'day', 'week', or 'month'.",
          }
      }

      // Calculate the start and end dates
      const endDate = new Date() // Today's date
      endDate.setHours(23, 59, 59, 999) // Set to the end of the day

      const startDate = new Date()
      startDate.setDate(endDate.getDate() - daysAgo)
      startDate.setHours(0, 0, 0, 0) // Set to the start of the day

      extra = {
        createdAt: {
          $gte: new Date(startDate).toISOString(),
          $lte: new Date(endDate).toISOString(),
        },
      }
    }

    // Fetch attendance data based on the constructed query
    const attendance = await AttendanceRepository.findAllAttendanceParams({
      ...params,
      ...extra,
      limit,
      skip,
      sort,
    })

    if (attendance.length < 1) {
      return { success: true, msg: "Attendance not available", data: [] }
    }

    return { success: true, msg: AttendanceSuccess.FETCH, data: attendance }
  }

  static async update(payload, id) {
    //confirm if attendance exist
    const validateAttendance =
      await AttendanceRepository.findSingleAttendanceWithParams({
        _id: new mongoose.Types.ObjectId(id),
      })

    if (!validateAttendance)
      return { success: false, msg: "Invalid attendance" }

    const { studentId, teacherId } = payload
    let updateData = {}

    if (Array.isArray(teacherId) && teacherId.length > 0) {
      updateData.teacherId = { $each: teacherId }
    }

    if (Array.isArray(studentId) && studentId.length > 0) {
      updateData.studentId = { $each: studentId }
    }

    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        msg: "No valid data for teacherId or studentId provided to add user to attendance",
      }
    }

    const attendance = await AttendanceRepository.updateAttendanceDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      { $push: updateData }
    )
    if (!attendance)
      return {
        success: false,
        msg: "Unable to add  user in attendance",
      }

    return {
      success: true,
      msg: "User added successfully",
    }
  }

  static async removeUserFromAttendance(payload, id) {
    //confirm if attendance exist
    const validateAttendance =
      await AttendanceRepository.findSingleAttendanceWithParams({
        _id: new mongoose.Types.ObjectId(id),
      })

    if (!validateAttendance)
      return { success: false, msg: "Invalid attendance" }

    const { studentId, teacherId } = payload
    let updateData = {}

    if (Array.isArray(teacherId) && teacherId.length > 0) {
      updateData.teacherId = { $in: teacherId }
    }

    if (Array.isArray(studentId) && studentId.length > 0) {
      updateData.studentId = { $in: studentId }
    }

    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        msg: "No valid data for teacherId or studentId provided to remove user from attendance",
      }
    }

    const attendance = await AttendanceRepository.updateAttendanceDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      { $pull: updateData }
    )
    if (!attendance)
      return {
        success: false,
        msg: "Unable to remove or user does not exist in attendance",
      }
    return {
      success: true,
      msg: "User removed successfully",
    }
  }
}

module.exports = { AttendanceService }
