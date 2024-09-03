const { ApprovedResult } = require("./approved.result.model")
const mongoose = require("mongoose")

class ApprovedResultRepository {
  static async create(payload) {
    return ApprovedResult.create(payload)
  }

  static async findApprovedResultWithParams(payload, select) {
    return ApprovedResult.find({ ...payload }).select(select)
  }

  static async findSingleApprovedResultWithParams(payload, select) {
    const approvedResult = ApprovedResult.findOne({ ...payload }).select(select)

    return approvedResult
  }

  static async validateApprovedResult(payload) {
    return ApprovedResult.exists({ ...payload })
  }

  static async findAllApprovedResultParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const approvedResult = ApprovedResult.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return approvedResult
  }

  static async updateApprovedResultDetails(id, params) {
    return ApprovedResult.findOneAndUpdate(
      { ...id },
      { ...params } //returns details about the update
    )
  }

  static async deleteApprovedResultById(id) {
    return ApprovedResult.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(id),
    })
  }
}

module.exports = { ApprovedResultRepository }
