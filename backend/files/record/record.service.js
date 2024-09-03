const { default: mongoose } = require("mongoose")
const { queryConstructor, gradeCalculation } = require("../../utils")
const { RecordSuccess, RecordFailure } = require("./record.messages")
const { RecordRepository } = require("./record.repository")
const { RemarksRepository } = require("../remarks/remarks.repository")

class RecordService {
  static async createRecord(recordPayload, locals) {
    const {
      resumptionTest,
      midTermTest,
      project,
      examScore,
      subjectId,
      schoolTerm,
    } = recordPayload
    if (!recordPayload.schoolTerm, !recordPayload.year)
      return { success: false, msg: `School term or year cannot be blank` }

    if (!locals.branchId)
      return {
        success: false,
        msg: `Only teachers with a class and branch are allowed to create record`,
      }
    if (!schoolTerm)
      return {
        success: false,
        msg: `School term cannot be empty`,
      }

    if (!subjectId)
      return {
        success: false,
        msg: `Subject cannot be empty`,
      }

    const userSubject = await RecordRepository.validateRecord({
      schoolTerm,
      studentId: new mongoose.Types.ObjectId(recordPayload.studentId),
      subjectId: new mongoose.Types.ObjectId(recordPayload.subjectId),
      classId: new mongoose.Types.ObjectId(recordPayload.classId),
      year: recordPayload.year,
    })

    if (userSubject)
      return {
        success: false,
        msg: `Record for Subject already added for student for this term`,
      }

    const confirmRecord = await RecordRepository.validateRecord({
      ...recordPayload,
      classId: new mongoose.Types.ObjectId(recordPayload.classId),
      studentId: new mongoose.Types.ObjectId(recordPayload.studentId),
      subjectId: new mongoose.Types.ObjectId(recordPayload.subjectId),
      branchId: new mongoose.Types.ObjectId(locals.branchId),
      year: recordPayload.year,
    })

    if (confirmRecord) return { success: false, msg: RecordFailure.EXIST }

    const record = await RecordRepository.create({
      schoolTerm: recordPayload.schoolTerm,
      resumptionTest: resumptionTest ? Number(recordPayload.resumptionTest) : 0,
      midTermTest: midTermTest ? Number(recordPayload.midTermTest) : 0,
      project: project ? Number(recordPayload.project) : 0,
      examScore: examScore ? Number(recordPayload.examScore) : 0,
      classId: new mongoose.Types.ObjectId(recordPayload.classId),
      subjectId: new mongoose.Types.ObjectId(recordPayload.subjectId),
      studentId: new mongoose.Types.ObjectId(recordPayload.studentId),
      branchId: new mongoose.Types.ObjectId(locals.branchId),
      year: recordPayload.year,
    })

    if (!record._id) return { success: false, msg: RecordFailure.CREATE }

    const { grade, customGrade } = gradeCalculation(Number(record.totalScore))

    record.grade = grade
    record.customGrade = customGrade
    await record.save()

    return {
      success: true,
      msg: RecordSuccess.CREATE,
      data: { _id: record._id },
    }
  }

  static async updateRecordService(payload, id) {
    const record = await RecordRepository.updateRecordDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        ...payload,
      }
    )

    if (!record) return { success: false, msg: RecordFailure.UPDATE }

    const { grade, customGrade } = gradeCalculation(Number(record.totalScore))

    record.grade = grade
    record.customGrade = customGrade
    await record.save()

    return {
      success: true,
      msg: RecordSuccess.UPDATE,
    }
  }

  static async getRecordService(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Record"
    )
    if (error) return { success: false, msg: error }

    let extra = {}

    let record = await RecordRepository.findAllRecordParams({
      ...params,
      ...extra,
      limit,
      skip,
      sort,
    })

    if (record.length < 1) {
      return {
        success: true,
        msg: `Possible record not currently available for this`,
        data: [],
      }
    }

    if (params.studentId && params.classId && params.schoolTerm) {
      const totalScore = record.reduce(
        (total, score) => total + score.totalScore,
        0
      )

      const averageTotalScore = totalScore / record.length
      const { grade, customGrade } = gradeCalculation(Number(averageTotalScore))

      const remarks = await RemarksRepository.findSingleRemarksWithParams({
        studentId: new mongoose.Types.ObjectId(params.studentId),
        classId: new mongoose.Types.ObjectId(params.classId),
        schoolTerm: params.schoolTerm,
      })

      return {
        success: true,
        msg: RecordSuccess.FETCH,
        data: record,
        totalScore,
        averageTotalScore,
        averageGrade: grade,
        gradeName: customGrade,
        remarks,
      }
    }

    return {
      success: true,
      msg: RecordSuccess.FETCH,
      data: record,
    }
  }

  //delete record
  static async deleteRecordService(id) {
    const record = await RecordRepository.deleteRecordDetails({
      _id: new mongoose.Types.ObjectId(id),
    })

    if (!record) return { success: false, msg: "Error deleting record" }

    return {
      success: true,
      msg: "Record deleted successfully",
    }
  }
}

module.exports = { RecordService }
