import mongoose, { FilterQuery, UpdateQuery } from "mongoose"
import pagination, { IPagination } from "../../constants"
import { IOrder } from "./order.interface"
import Order from "./order.model"
import { ICoord } from "../user/user.interface"
const { LIMIT, SKIP, SORT } = pagination

export default class OrderRepository {
  static async createOrder(orderPayload: Partial<IOrder>): Promise<IOrder> {
    return Order.create(orderPayload)
  }

  static async fetchAllOrders(
    orderPayload: Partial<IOrder> | FilterQuery<Partial<IOrder>>,
  ) {
    const order = await Order.find({
      ...orderPayload,
    })
    return order
  }

  static async fetchOrder(
    orderPayload: Partial<IOrder> | FilterQuery<Partial<IOrder>>,
    select: Partial<Record<keyof IOrder, number | Boolean | object>>,
  ): Promise<Partial<IOrder> | null> {
    const order: Awaited<IOrder | null> = await Order.findOne(
      {
        ...orderPayload,
      },
      select,
    ).lean().populate("itemId._id")

    return order
  }

  static async updateOrderDetails(
    orderPayload: FilterQuery<Partial<IOrder>>,
    update: UpdateQuery<Partial<IOrder>>,
  ) {
    const updateOrder = await Order.findOneAndUpdate(
      {
        ...orderPayload,
      },
      { ...update },
      { new: true, runValidators: true },
    )

    return updateOrder
  }

  static async updateManyOrderDetails(
    orderPayload: FilterQuery<Partial<IOrder>>,
    update: UpdateQuery<Partial<IOrder>>,
    options: any,
  ) {
    const result = await Order.updateMany(
      {
        ...orderPayload,
      },
      { ...update },
      { ...options },
    )

    return result
  }

  static async updateManyOrder(
    orderPayload: FilterQuery<Partial<IOrder>>,
    update: UpdateQuery<Partial<IOrder>>,
  ) {
    const updateOrder = await Order.updateMany(
      {
        ...orderPayload,
      },
      { ...update },
      { new: true, runValidators: true },
    )

    return updateOrder
  }

  static async fetchOrderByParams(orderPayload: Partial<IOrder & IPagination>) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = orderPayload
    const { schedule } = restOfPayload

    if (schedule) {
      const order: Awaited<IOrder[] | null> = await Order.find({
        ...restOfPayload,
      })
        .populate({
          path: "vendorId",
          select:
            "name email address businessNumber vendorType ratingAverage isAvailable image locationCoord",
        })
        .populate({
          path: "assignedRider",
          select: "firstName lastName email image",
        })
        .populate({ path: "itemId._id" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

      return order
    }
    const order: Awaited<IOrder[] | null> = await Order.find({
      ...restOfPayload,
    })
      .populate({
        path: "vendorId",
        select:
          "name email address businessNumber vendorType ratingAverage isAvailable image locationCoord",
      })
      .populate({
        path: "assignedRider",
        select: "firstName lastName email image",
      })
      .populate({ path: "itemId._id" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    return order
  }

  static async fetchOrderLocations(
    orderPayload: Partial<IOrder & IPagination & ICoord & { _id?: string }>,
  ) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = orderPayload

    let { lat, lng, search, _id, ...extraParams } = restOfPayload
    if (!search) search = ""

    let latToString: any = lat?.toString()
    let lngToString: any = lng?.toString()

    let latString: string = latToString
    let lngString: string = lngToString
    const floatString = "16000"

    const order = await Order.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lngString), parseFloat(latString)],
          },
          key: "locationCoord",
          maxDistance: parseFloat(floatString),
          distanceField: "distance",
          spherical: true,
        },
      },
      {
        $lookup: {
          from: "vendor",
          localField: "vendorId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
                address: 1,
                phoneNumber: 1,
                locationCoord: 1,
              },
            },
          ],
          as: "vendorDetails",
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "orderedBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "item",
          localField: "itemId._id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                description: 1,
                price: 1,
                image: 1,
              },
            },
          ],
          as: "itemDetails",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: {
          $and: [
            {
              $or: [{ deliveryAddress: { $regex: search, $options: "i" } }],
              paymentStatus: "paid",
              ...(_id ? { _id: new mongoose.Types.ObjectId(_id) } : {}),
              ...extraParams,
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          deliveryAddress: 1,
          locationCoord: 1,
          totalDistance: 1,
          ridersFee: 1,
          schedule: 1,
          vendorDetails: 1,
        },
      },
    ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    return order
  }

  static async riderOrderWithoutLocations(
    orderPayload: Partial<IOrder & IPagination>,
  ) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = orderPayload

    const order = await Order.aggregate([
      {
        $lookup: {
          from: "vendor",
          localField: "vendorId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
                locationCoord: 1,
                address: 1,
                phone: 1,
                image: 1,
              },
            },
          ],
          as: "vendorDetails",
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "orderedBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "item",
          localField: "itemId._id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                description: 1,
                price: 1,
                image: 1,
              },
            },
          ],
          as: "itemDetails",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: {
          paymentStatus: "paid",
          ...restOfPayload,
        },
      },
    ])
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)

    return order
  }

  static async adminOrderChartAnalysis() {
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const countsByMonth = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: ["completed", "pending"] },
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            status: "$orderStatus",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.status": 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          status: "$_id.status",
          count: 1,
        },
      },
    ])

    return countsByMonth
  }
}
