const { handleApplicationErrors, notFound } = require("./response")

const express = require("express")
const cors = require("cors")
const xss = require("xss-clean")
const helmet = require("helmet")
const compression = require("compression")
const mongoSanitize = require("express-mongo-sanitize")
const emailValidation = require("./emailCheck")
const routes = require("./routes")

const app = express()

let whitelist = ["*"] // allow all
let corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes("*") || whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
}

const application = () => {
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(helmet())
  app.use(xss())
  app.use(mongoSanitize())
  app.use(compression())
  app.use(emailValidation)

  app.get("/", (req, res) => {
    res.status(200).json({ message: "creative_school_project is working fine" })
  })

  routes(app)
  app.use(handleApplicationErrors) //application errors handler
  app.use(notFound)
}

module.exports = { app, application }
