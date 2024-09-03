const { default: mongoose } = require("mongoose")
const {
  hashPassword,
  queryConstructor,
  verifyPassword,
  tokenHandler,
  AlphaNumeric,
} = require("../../utils")
const { StudentSuccess, StudentFailure } = require("./student.messages")
const { StudentRepository } = require("./student.repository")
const { sendMailNotification } = require("../../utils/email")
const { SchoolClassRepository } = require("../class/schoolClass.repository")

class StudentService {
  static async createStudent(payload, params) {
    const { body, image } = payload
    const { name, email, password, intendedClass } = body
    if (!intendedClass)
      return {
        success: false,
        msg: `Cannot create student without intended class`,
      }

    let validId = `CKA/${AlphaNumeric(4)}`
    // Initial check for validId existence
    let isValid = await StudentRepository.findSingleStudentWithParams({
      validId,
    })

    // Loop until a unique validId is found
    while (isValid) {
      validId = `CKA/${AlphaNumeric(4)}`
      // Recheck for the new validId
      isValid = await StudentRepository.findSingleStudentWithParams({ validId })
    }

    let literalPassword = await hashPassword(password)

    const student = await StudentRepository.create({
      ...body,
      validId,
      profileImage: image,
      branchId: new mongoose.Types.ObjectId(params?.branchId),
      password: literalPassword,
    })

    if (!student._id) return { success: false, msg: StudentFailure.CREATE }

    if (student) {
      await SchoolClassRepository.updateSchoolClassDetails(
        { _id: new mongoose.Types.ObjectId(body.intendedClass) },
        { $push: { studentId: student._id } }
      )
    }

    try {
      const substitutional_parameters = {
        name: name,
        password: password,
        email: email,
      }

      Promise.all([
        await sendMailNotification(
          email,
          "WELCOME TO CREATIVE SCHOOL",
          substitutional_parameters,
          "CREATIVE_WELCOME"
        ),
        await sendMailNotification(
          params.email,
          "WELCOME TO CREATIVE SCHOOL",
          { email: email, name: body.name, password: password, email: email },
          "STUDENT_CREATED"
        ),
      ])
    } catch (error) {
      console.log("error", error)
    }

    return {
      success: true,
      msg: StudentSuccess.CREATE,
    }
  }

  static async studentLogin(payload) {
    const { email, password, validId } = payload

    const studentProfile = await StudentRepository.findSingleStudentWithParams({
      email: email,
      validId,
    })

    if (!studentProfile)
      return {
        success: false,
        msg: "Email or Id invalid/not a registered user",
      }

    const isPassword = await verifyPassword(password, studentProfile.password)

    if (!isPassword) return { success: false, msg: `invalid password` }

    let token

    studentProfile.password = undefined

    token = await tokenHandler({
      _id: studentProfile._id,
      name: studentProfile.name,
      email: studentProfile.email,
      accountType: studentProfile.accountType,
      intendedClass: studentProfile.intendedClass,
      branchId: studentProfile.branchId,
      isAdmin: false,
    })

    const student = {
      _id: studentProfile._id,
      name: studentProfile.name,
      validId: studentProfile.validId,
      email: studentProfile.email,
      accountType: studentProfile.accountType,
      intendedClass: studentProfile.intendedClass,
      branchId: studentProfile.branchId,
      ...token,
    }

    //return result
    return {
      success: true,
      msg: StudentSuccess.FETCH,
      data: student,
    }
  }

  static async getStudent(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Student"
    )
    if (error) return { success: false, msg: error }

    const students = await StudentRepository.findAllStudentsParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (students.length < 1)
      return { success: true, msg: StudentFailure.FETCH, date: [] }

    return { success: true, msg: StudentSuccess.FETCH, data: students }
  }

  static async updateStudent(payload, id, locals) {
    const { body, image } = payload

    if (!locals.isAdmin) {
      delete body.email
    }

    let status = "active"
    if (body.status) {
      status = body.status
    }

    const findStudent = await StudentRepository.findSingleStudentWithParams({
      _id: new mongoose.Types.ObjectId(id),
    })

    if (!findStudent) return { success: false, msg: StudentFailure.FETCH }

    const student = await StudentRepository.updateStudentDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        ...body,
        status,
        profileImage: image,
      }
    )

    if (!student) return { success: false, msg: StudentFailure.UPDATE }

    if (student && body.intendedClass) {
      await Promise.all([
        SchoolClassRepository.updateSchoolClassDetails(
          { _id: new mongoose.Types.ObjectId(body.intendedClass) },
          { $push: { studentId: student._id } }
        ),
      ])
    }
    return {
      success: true,
      msg: StudentSuccess.UPDATE,
    }
  }

  static async studentImage(payload, id) {
    const { image } = payload
    const student = await StudentRepository.updateUserProfile(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        profileImage: image,
      }
    )

    if (!student) return { success: false, msg: StudentFailure.UPDATE }

    return { success: true, msg: StudentSuccess.UPDATE }
  }

  static async deleteStudentService(payload) {
    const user = await StudentRepository.deleteStudentById(payload)

    if (!user) return { success: false, msg: `Unable to delete User` }

    return { success: true, msg: `User successfully deleted` }
  }

  static async sendMailNotificationToStudent() {
    const students = await StudentRepository.findStudentWithParams()

    // Define the batch size
    const batchSize = 10 // Further reduced batch size

    for (let i = 0; i < students.length; i += batchSize) {
      const batch = students.slice(i, i + batchSize)

      try {
        for (const student of batch) {
          await sendMailNotification(
            student.email,
            "Important Update: Login Credentials for Your Child's Account",
            { studentId: student.validId },
            "UPDATE"
          )

          // Add delay between sending individual emails within a batch
          await new Promise((resolve) => setTimeout(resolve, 2000)) // 2 seconds delay
        }
      } catch (error) {
        console.log("sending mail error", error)
      }

      // Wait before sending the next batch (e.g., 10 seconds)
      await new Promise((resolve) => setTimeout(resolve, 50000)) // 10 seconds delay
    }

    return { success: true, msg: "Emails successfully sent to all students" }
  }
}
module.exports = { StudentService }
