const userRoute = require("../files/user/user.route")
const authRoute = require("../files/auth/auth.route")
const notificationRoute = require("../files/notification/notification.route")
const adminRoute = require("../files/admin/admin.routes")
const branchRoute = require("../files/branch/branch.route")
const studentRoute = require("../files/student/student.route")
const schoolClassRoute = require("../files/class/schoolClass.route")
const subjectRoute = require("../files/subject/subject.route")
const recordRoute = require("../files/record/record.route")
const remarksModel = require("../files/remarks/remarks.route")
const noticeRoute = require("../files/notice/notice.route")
const reportRoute = require("../files/report/report.route")
const timeTableRoute = require("../files/time.table/time.table.route")
const approvalResultRoute = require("../files/approved.result/approved.result..route")
const attendanceRouter = require("../files/attendance/attendance.route")

const routes = (app) => {
  const base_url = "/api/v1"

  app.use(`${base_url}/user`, userRoute)
  app.use(`${base_url}/auth`, authRoute)
  app.use(`${base_url}/notification`, notificationRoute)
  app.use(`${base_url}/admin`, adminRoute)
  app.use(`${base_url}/branch`, branchRoute)
  app.use(`${base_url}/student`, studentRoute)
  app.use(`${base_url}/class`, schoolClassRoute)
  app.use(`${base_url}/subject`, subjectRoute)
  app.use(`${base_url}/record`, recordRoute)
  app.use(`${base_url}/remarks`, remarksModel)
  app.use(`${base_url}/notice`, noticeRoute)
  app.use(`${base_url}/report`, reportRoute)
  app.use(`${base_url}/time-table`, timeTableRoute)
  app.use(`${base_url}/approval-result`, approvalResultRoute)
  app.use(`${base_url}/attendance`, attendanceRouter)
}

module.exports = routes
