import { NextFunction, Response, Request, query } from "express"
import { responseHandler } from "../../core/response"
import { fileModifier, manageAsyncOps } from "../../utils"
import { CustomError } from "../../utils/error"
import { statusCode } from "../../constants/statusCode"
import OrderService from "./order.service"

class OrderController {
  async evaluateOrderController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const [error, data] = await manageAsyncOps(
      OrderService.evaluateOrderService(req.body, res.locals.jwt),
    )
    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))
    return responseHandler(res, statusCode.CREATED, data!)
  }

  async evaluateScheduleOrderController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const [error, data] = await manageAsyncOps(
      OrderService.evaluateScheduleOrderService(req.body, res.locals.jwt),
    )
    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, statusCode.CREATED, data!)
  }

  //fetch
  async fetchOrderController(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      OrderService.fetchOrderService(req.query, res.locals.jwt),
    )
    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  async riderScheduleItem(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      OrderService.riderScheduleItem(
        req.params.id as string,
        res.locals.jwt._id as string,
      ),
    )

    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  async updateOrderController(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      OrderService.updateOrderService(
        req.params.orderId as string,
        req.body,
        res.locals.jwt._id as string,
        res.locals.jwt?.isPartner,
      ),
    )
    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  async updateScheduleController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const [error, data] = await manageAsyncOps(
      OrderService.updateScheduleOrderService({
        orderId: req.params.orderId as string,
        period: req.body.period,
        day: req.body.day,
        scheduleStatus: req.body.scheduleStatus,
        locals: res.locals.jwt,
      }),
    )
    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  async orderAnalysisController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const [error, data] = await manageAsyncOps(
      OrderService.orderAnalysisService(res.locals.jwt._id, req.query),
    )

    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  async adminOrderAnalysisController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const [error, data] = await manageAsyncOps(
      OrderService.adminOrderAnalysisService(),
    )

    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  async adminDashBoardController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const [error, data] = await manageAsyncOps(
      OrderService.adminDashboardAnalysis(),
    )

    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  //admin cancelling order controller
  async adminCancellingOrder(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      OrderService.adminCancellingOrder({ _id: req.params.id }),
    )

    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  //fetch specific schedule item
  async fetchScheduleItem(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      OrderService.fetchSpecificScheduleItem(
        req.body,
        req.params.orderId as string,
      ),
    )
    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  //fetch specific schedule item
  async fetchScheduleItemForDay(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const [error, data] = await manageAsyncOps(
      OrderService.fetchScheduleItemForDay(req.params.orderId as string),
    )
    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  //get weekly schedule item
  async fetchWeeklySchedule(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      OrderService.fetchWeeklySchedule(req.params.orderId as string),
    )
    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, statusCode.SUCCESS, data!)
  }
}

export default new OrderController()
