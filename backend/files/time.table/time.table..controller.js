const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { TimeTableService } = require("./time.table.service")

const createTimeTableController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    TimeTableService.createTimeTable(req.body)
  )

  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const fetchTimeTableController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    TimeTableService.getTimeTable(req.query)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const updateTimeTableController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    TimeTableService.updateTimeTable(req.body, req.params.tableId)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, 200, data)
}

const deleteTimeTableController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    TimeTableService.removeTimeTable(req.query)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, 200, data)
}

module.exports = {
  createTimeTableController,
  fetchTimeTableController,
  updateTimeTableController,
  deleteTimeTableController,
}
