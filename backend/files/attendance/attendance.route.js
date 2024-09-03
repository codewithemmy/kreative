const attendanceRouter = require("express").Router()
const { isAuthenticated } = require("../../utils")
const {
  createAttendance,
  fetchAttendance,
  updateAttendance,
  removeUserAttendance,
} = require("./attendance.controller")

attendanceRouter.use(isAuthenticated)

//routes
attendanceRouter.route("/").post(createAttendance)
attendanceRouter.route("/").get(fetchAttendance)
attendanceRouter.patch("/:id", updateAttendance)
attendanceRouter.patch("/remove/:id", removeUserAttendance)

module.exports = attendanceRouter
