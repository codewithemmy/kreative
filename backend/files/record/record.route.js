const recordRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

const {
  createRecordController,
  getRecordController,
  updateRecordController,
  deleteRecordController,
} = require("./record.controller")

recordRoute.route("/").get(getRecordController)
recordRoute.use(isAuthenticated)

//routes
recordRoute.route("/").post(createRecordController)
recordRoute.route("/:id").patch(updateRecordController)

//delete
recordRoute.route("/:id").delete(deleteRecordController)

module.exports = recordRoute
