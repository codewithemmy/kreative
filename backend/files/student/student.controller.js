const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { StudentService } = require("./student.service")

const createStudentController = async (req, res, next) => {
  const value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    StudentService.createStudent(value, res.locals.jwt)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const studentLoginController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    StudentService.studentLogin(req.body)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const getStudentController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    StudentService.getStudent(req.query)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const updateStudentController = async (req, res, next) => {
  const value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    StudentService.updateStudent(value, req.params.id, res.locals.jwt)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const studentImageController = async (req, res, next) => {
  const value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    StudentService.studentImage(value, req.params.id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const deleteStudentController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    StudentService.deleteStudentService(req.params.id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, 200, data)
}

const sendingMailController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    StudentService.sendMailNotificationToStudent()
  )
  console.log("error", error)
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, 200, data)
}

module.exports = {
  createStudentController,
  getStudentController,
  updateStudentController,
  studentImageController,
  deleteStudentController,
  studentLoginController,
  sendingMailController,
}
