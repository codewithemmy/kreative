const { default: mongoose } = require("mongoose")
const { queryConstructor } = require("../../utils")
const { TimeTableSuccess, TimeTableFailure } = require("./time.table.messages")
const { TimeTableRepository } = require("./time.table.repository")

class TimeTableService {
  static async createTimeTable(payload) {
    const { classId, period } = payload
    const { startTime, endTime, subject, type, day } = period

    if (!classId || !startTime || !endTime || !subject || !type || !day) {
      return {
        success: false,
        msg: `Either classId, startTime, endTime, day, or subject is missing`,
      }
    }

    // Check if time table for the period already exists
    const validateTimeTable =
      await TimeTableRepository.findSingleTimeTableWithParams({
        period: { $elemMatch: { day, type } },
        classId: new mongoose.Types.ObjectId(classId),
      })

    if (validateTimeTable) {
      return {
        success: false,
        msg: `This period is already assigned to a subject`,
      }
    }

    const timeTable = await TimeTableRepository.create({
      period: [
        {
          day,
          subject,
          type,
          startTime,
          endTime,
        },
      ],
      classId: new mongoose.Types.ObjectId(classId),
    })

    if (!timeTable._id) {
      return { success: false, msg: TimeTableFailure.CREATE }
    }

    return {
      success: true,
      msg: TimeTableSuccess.CREATE,
      data: { _id: timeTable._id, classId: timeTable.classId },
    }
  }

  static async updateTimeTable(payload, id) {
    const { startTime, endTime, subject, type, day } = payload.period

    if (!startTime || !endTime || !subject || !type || !day) {
      return {
        success: false,
        msg: `Either , startTime, endTime, day, or subject is missing`,
      }
    }

    // Check if time table for the period already exists
    const validateTimeTable =
      await TimeTableRepository.findSingleTimeTableWithParams({
        period: { $elemMatch: { day, type } },
      })

    if (validateTimeTable) {
      return {
        success: false,
        msg: `This period is already assigned to a subject`,
      }
    }
    const timeTable = await TimeTableRepository.updateTableTableDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $push: { ...payload },
      }
    )

    if (!timeTable) return { success: false, msg: TimeTableFailure.UPDATE }

    return {
      success: true,
      msg: TimeTableSuccess.UPDATE,
    }
  }

  static async getTimeTable(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "TimeTable"
    )
    if (error) return { success: false, msg: error }

    const timeTable = await TimeTableRepository.findAllTimeTableParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (timeTable.length < 1)
      return { success: true, msg: TimeTableFailure.FETCH, data: [] }

    return { success: true, msg: TimeTableSuccess.FETCH, data: timeTable }
  }

  static async deleteTimeTable(payload) {
    const timeTable = await TimeTableRepository.deleteTimeTableById(payload)

    if (!timeTable)
      return { success: false, msg: `Unable to delete time table` }

    return { success: true, msg: `Time table successfully deleted` }
  }

  //pull or delete time table
  static async removeTimeTable(payload) {
    const { type, day, classId } = payload

    // Validate payload
    if (!type || !day || !classId) {
      return {
        success: false,
        msg: "Type, day or classId cannot be missing",
      }
    }
    // Check if the timetable for the specified period exists
    const validateTimeTable =
      await TimeTableRepository.findSingleTimeTableWithParams({
        period: { $elemMatch: { day, type } },
        classId: new mongoose.Types.ObjectId(classId),
      })

    if (!validateTimeTable) {
      return {
        success: false,
        msg: "Invalid timetable",
      }
    }

    // Pull the period from the timetable array
    const timeTable = await TimeTableRepository.updateTableTableDetails(
      { classId: new mongoose.Types.ObjectId(classId) },
      {
        $pull: { period: { day, type } },
      }
    )

    if (!timeTable) {
      return {
        success: false,
        msg: "Unable to delete timetable",
      }
    }

    return {
      success: true,
      msg: "Timetable deleted successfully",
    }
  }
}

module.exports = { TimeTableService }
