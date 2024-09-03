const timeTableRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const {
  createTimeTableController,
  fetchTimeTableController,
  deleteTimeTableController,
  updateTimeTableController,
} = require("./time.table..controller")

timeTableRoute.use(isAuthenticated)

//routes
timeTableRoute.route("/").post(createTimeTableController)
timeTableRoute.route("/").get(fetchTimeTableController)
timeTableRoute.patch("/:tableId", updateTimeTableController)
timeTableRoute.route("/").delete(deleteTimeTableController)

module.exports = timeTableRoute
