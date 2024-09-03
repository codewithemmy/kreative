const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { ApprovedResultService } = require("./approved.result.service")

const create = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ApprovedResultService.create(req.body)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const fetch = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ApprovedResultService.fetch(req.query)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const update = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ApprovedResultService.update(req.body, req.params.id)
  )

  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, 200, data)
}

const remove = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ApprovedResultService.delete(req.params.id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, 200, data)
}

module.exports = {
  create,
  fetch,
  update,
  remove,
}
