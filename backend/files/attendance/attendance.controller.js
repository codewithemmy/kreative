const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { AttendanceService } = require("./attendance.service")

const createAttendance = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(AttendanceService.create(req.body))
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const fetchAttendance = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AttendanceService.getAttendance(req.query)
  )

  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const updateAttendance = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AttendanceService.update(req.body, req.params.id)
  )

  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, 200, data)
}

const removeUserAttendance = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AttendanceService.removeUserFromAttendance(req.body, req.params.id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, 200, data)
}

module.exports = {
  createAttendance,
  fetchAttendance,
  updateAttendance,
  removeUserAttendance,
}
