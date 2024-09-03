import express from "express"
import { isAuthenticated, userVerifier } from "../../utils"
import orderController from "./order.controller"
const {
  evaluateOrderController,
  evaluateScheduleOrderController,
  fetchOrderController,
  updateOrderController,
  orderAnalysisController,
  updateScheduleController,
  riderScheduleItem,
  fetchScheduleItem,
  fetchScheduleItemForDay,
  fetchWeeklySchedule,
} = orderController

const OrderRouter = express.Router()

OrderRouter.use(isAuthenticated)

//routes
OrderRouter.post("/", userVerifier, evaluateOrderController)
OrderRouter.post("/schedule", userVerifier, evaluateScheduleOrderController)
OrderRouter.get("/", userVerifier, fetchOrderController)
OrderRouter.get("/schedule-item/:id", userVerifier, riderScheduleItem)
OrderRouter.patch("/:orderId", userVerifier, updateOrderController)
OrderRouter.patch("/schedule/:orderId", userVerifier, updateScheduleController)

//analysis route
OrderRouter.get("/analysis", userVerifier, orderAnalysisController)

//fetch specific item
OrderRouter.get("/specific-schedule/:orderId", userVerifier, fetchScheduleItem)
OrderRouter.get("/day-schedule/:orderId", userVerifier, fetchScheduleItemForDay)

//user weekly schedule order
OrderRouter.get("/weekly-schedule/:orderId", userVerifier, fetchWeeklySchedule)

export default OrderRouter
