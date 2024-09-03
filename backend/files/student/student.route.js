const { uploadManager } = require("../../utils/multer")
const studentRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const {
  createStudentController,
  getStudentController,
  updateStudentController,
  studentImageController,
  deleteStudentController,
  studentLoginController,
  sendingMailController,
} = require("./student.controller")

studentRoute.route("/login").post(studentLoginController)

studentRoute.use(isAuthenticated)
//routes
studentRoute
  .route("/")
  .post(uploadManager("image").single("single"), createStudentController)
  .get(getStudentController)

studentRoute
  .route("/:id")
  .patch(uploadManager("image").single("image"), studentImageController)
  .put(uploadManager("image").single("image"), updateStudentController)

studentRoute.route("/:id").delete(deleteStudentController)
studentRoute.route("/sending-mail").post(sendingMailController)

module.exports = studentRoute
