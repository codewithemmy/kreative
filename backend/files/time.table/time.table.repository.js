const { TimeTable } = require("./time.table.model")
const mongoose = require("mongoose")

class TimeTableRepository {
  static async create(payload) {
    return TimeTable.create(payload)
  }

  static async findTimeTableWithParams(payload, select) {
    return TimeTable.find({ ...payload }).select(select)
  }

  static async findSingleTimeTableWithParams(payload, select) {
    const timeTable = TimeTable.findOne({ ...payload }).select(select)

    return timeTable
  }

  static async validateTimeTable(payload) {
    return TimeTable.exists({ ...payload })
  }

  static async findAllTimeTableParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const timeTable = TimeTable.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return timeTable
  }

  static async updateTableTableDetails(id, params) {
    return TimeTable.findOneAndUpdate(
      { ...id },
      { ...params } //returns details about the update
    )
  }

  static async deleteTimeTableById(id) {
    return TimeTable.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) })
  }
}

module.exports = { TimeTableRepository }
