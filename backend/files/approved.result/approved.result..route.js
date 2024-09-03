const approvalResultRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const {
  create,
  fetch,
  update,
  remove,
} = require("./approved.result.controller")

approvalResultRoute.use(isAuthenticated)

//routes
approvalResultRoute.route("/").post(create)
approvalResultRoute.route("/").get(fetch)
approvalResultRoute.route("/:id").delete(remove)

approvalResultRoute.patch("/:id", update)

module.exports = approvalResultRoute
