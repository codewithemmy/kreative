const { default: mongoose } = require("mongoose")
const { queryConstructor } = require("../../utils")
const {
  ApprovedResultSuccess,
  ApprovedResultFailure,
} = require("./approved.result..messages")
const { ApprovedResultRepository } = require("./approved.result.repository")

class ApprovedResultService {
  static async create(payload) {
    const { year, schoolTerm, classId } = payload
    if (!year || !schoolTerm || !classId)
      return {
        success: false,
        msg: "Year, school term or classId field cannot be empty",
      }

    const validateApproval =
      await ApprovedResultRepository.validateApprovedResult({
        year,
        schoolTerm,
        classId: new mongoose.Types.ObjectId(classId),
      })

    if (validateApproval)
      return { success: false, msg: ApprovedResultFailure.EXIST }

    const approval = await ApprovedResultRepository.create({
      year,
      schoolTerm,
      classId: new mongoose.Types.ObjectId(classId),
      isApproved: true,
    })

    if (!approval._id)
      return { success: false, msg: ApprovedResultFailure.CREATE }

    return {
      success: true,
      msg: ApprovedResultSuccess.CREATE,
    }
  }

  static async update(payload, id) {
    const approval = await ApprovedResultRepository.updateApprovedResultDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        ...payload,
      }
    )

    if (!approval) return { success: false, msg: ApprovedResultFailure.UPDATE }

    return {
      success: true,
      msg: ApprovedResultSuccess.UPDATE,
    }
  }

  static async fetch(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "ApprovalResult"
    )
    if (error) return { success: false, msg: error }

    const approval = await ApprovedResultRepository.findAllApprovedResultParams(
      {
        ...params,
        limit,
        skip,
        sort,
      }
    )

    if (approval.length < 1)
      return { success: true, msg: ApprovedResultFailure.FETCH, data: [] }

    return { success: true, msg: ApprovedResultSuccess.FETCH, data: approval }
  }

  static async delete(payload) {
    const approval = await ApprovedResultRepository.deleteApprovedResultById(
      payload
    )

    if (!approval)
      return { success: false, msg: `Unable to delete approval result` }

    return { success: true, msg: `Approval result successfully deleted` }
  }
}

module.exports = { ApprovedResultService }
