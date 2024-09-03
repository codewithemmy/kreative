import mongoose, { mongo } from "mongoose"
import { IResponse } from "../../constants"
import {
  AlphaNumeric,
  RandomFourDigits,
  deg2rad,
  queryConstructor,
} from "../../utils"
import OrderRepository from "./order.repository"
import { orderMessages } from "./order.messages"
import VendorRepository from "../partner/vendor/vendor.repository"
import { partnerMessages } from "../partner/partner.messages"
import UserRepository from "../user/user.repository"
import ItemRepository from "../item/item.repository"
import { IOrder, IWeek } from "./order.interface"
import NotificationRepository from "../notifications/notification.repository"
import { Expo } from "expo-server-sdk"
const expo = new Expo()

export default class OrderService {
  static async evaluateOrderService(
    orderPayload: {
      vendorId: string
      isEvent?: Boolean
      isBulk?: Boolean
      daysOfEvent?: Number
      lng?: any
      lat?: any
      item: [
        {
          _id: any
          quantity: Number
          price: Number
          day?: Date
          period?: "breakfast" | "lunch" | "dinner"
          preferredTime?: string
          scheduleStatus?: string
        },
      ]
      note?: string
      pickUp?: Boolean
      deliveryAddress: string
      startDate?: Date
      endDate?: Date
      startTime?: string
      endTime?: string
      eventDescription?: string
      eventLocation?: string
      schedule?: boolean
    },
    locals: any,
  ): Promise<IResponse> {
    const {
      vendorId,
      lng,
      lat,
      item,
      note,
      deliveryAddress,
      pickUp,
      isEvent,
      isBulk,
      startDate,
      endDate,
      startTime,
      endTime,
      eventDescription,
      daysOfEvent,
      eventLocation,
      schedule,
    } = orderPayload
    let kilometers: any
    const vendor = await VendorRepository.fetchVendor(
      {
        _id: new mongoose.Types.ObjectId(vendorId),
      },
      {},
    )
    if (!vendor) return { success: false, msg: partnerMessages.VENDOR_ERROR }
    let randomOrderId = `#${AlphaNumeric(4, "number")}`

    let existingOrderCode = await OrderRepository.fetchOrder(
      {
        orderId: randomOrderId,
      },
      {},
    )

    while (existingOrderCode) {
      randomOrderId = AlphaNumeric(4, "number")
      existingOrderCode = await OrderRepository.fetchOrder(
        {
          orderId: randomOrderId,
        },
        {},
      )
    }

    const customer = await UserRepository.fetchUser(
      { _id: new mongoose.Types.ObjectId(locals._id) },
      {},
    )

    if (!customer) return { success: false, msg: `unable to identify customer` }
    let ridersFee
    let vendorLng: any
    let vendorLat: any

    if (deliveryAddress) {
      // Check if vendor.locationCoord is defined before accessing its properties
      if (vendor?.locationCoord && vendor?.locationCoord?.coordinates) {
        vendorLng = vendor?.locationCoord?.coordinates[0]
        vendorLat = vendor?.locationCoord?.coordinates[1]
      } else {
        // Handle the case where locationCoord or coordinates is undefined
        return {
          success: false,
          msg: "Location coordinates not available for the vendor.",
        }
      }

      // Radius of the Earth in kilometers
      const R = 6371.0
      // Convert latitude and longitude from degrees to radians
      const lat1Rad: any = deg2rad(vendorLat)
      const lon1Rad: any = deg2rad(vendorLng)
      const lat2Rad: any = deg2rad(lat)
      const lon2Rad: any = deg2rad(lng)

      // Haversine formula
      const dLat = lat2Rad - lat1Rad
      const dLon = lon2Rad - lon1Rad
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) *
          Math.cos(lat2Rad) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c

      kilometers = distance.toFixed(2)
    }

    const allItems = await ItemRepository.findAllItems({})

    const result = item.map((payloadItem) => {
      // Check if the payload item's _id exists in the database
      const matchingItem = allItems.find(
        (item) => item._id.toString() === payloadItem._id,
      )

      return matchingItem
    })

    if (!result) return { success: false, msg: orderMessages.NOT_AVAILABLE }
    // Calculate the total price based on the item array
    const netAmount: any = item.reduce((total, currentItem: any) => {
      return total + currentItem.price * currentItem.quantity
    }, 0)

    let orderItems: { _id: any; quantity: Number; price: Number }[] = []

    item.forEach((payloadItem) => {
      orderItems.push({
        _id: payloadItem._id,
        quantity: payloadItem.quantity,
        price: payloadItem.price,
      })
    })

    let serviceCharge
    let parsePickUpNumber
    let totalPrice: any
    let pickUpNumber

    try {
      pickUpNumber = RandomFourDigits()
      let existingCode = await OrderRepository.fetchOrder(
        {
          pickUpCode: pickUpNumber,
        },
        {},
      )
      while (existingCode) {
        pickUpNumber = RandomFourDigits()
        existingCode = await OrderRepository.fetchOrder(
          {
            pickUpCode: pickUpNumber,
          },
          {},
        )
      }
    } catch (error) {
      console.log("pick up code error", error)
    }

    if (deliveryAddress) {
      ridersFee = kilometers * 2
      const parseAmount: any = Number(netAmount)
      totalPrice = parseAmount
      serviceCharge = (10 * totalPrice) / 100
      parsePickUpNumber = Number(pickUpNumber)
    }

    if (pickUp) {
      ridersFee = 0
      const parseAmount: any = Number(netAmount)
      totalPrice = parseAmount
      serviceCharge = (10 * totalPrice) / 100
      parsePickUpNumber = Number(pickUpNumber)
    }

    if (isEvent) {
      ridersFee = 0
    }

    const totalSum: any = serviceCharge + totalPrice + ridersFee

    let location: any = {
      type: "Point",
      coordinates: [parseFloat("0"), parseFloat("0")],
    }

    if (lat && lng) {
      location = {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      }
    }

    let itemLength
    let totalDistance: Number = kilometers

    if (schedule && !pickUp) {
      switch (schedule) {
        case true:
          // Count the periods and days
          let breakfastCount = 0
          let lunchCount = 0
          let dinnerCount = 0

          item.forEach((payloadItem) => {
            if (payloadItem.period === "breakfast") {
              breakfastCount++
            } else if (payloadItem.period === "lunch") {
              lunchCount++
            } else if (payloadItem.period === "dinner") {
              dinnerCount++
            }
          })

          itemLength = breakfastCount + lunchCount + dinnerCount
          totalDistance = itemLength * kilometers
          break
        default:
          throw Error("Invalid schedule")
      }
    }
    if (pickUp && schedule) {
      switch (schedule && pickUp) {
        case true:
          itemLength = 0
          totalDistance = 0
          break

        default:
          throw Error("Invalid schedule and pick up")
      }
    }

    if (pickUp) {
      switch (pickUp) {
        case true:
          itemLength = 0
          totalDistance = 0
          break

        default:
          throw Error("Invalid pick up")
      }
    }

    const currentOrder = await OrderRepository.createOrder({
      pickUpCode: parsePickUpNumber,
      orderId: randomOrderId,
      numberOfTrips: itemLength,
      totalDistance: Number(totalDistance),
      pickUp,
      deliveryAddress,
      itemId: item,
      orderedBy: new mongoose.Types.ObjectId(locals._id),
      vendorId: new mongoose.Types.ObjectId(vendor._id),
      locationCoord: location,
      userEmail: locals.email,
      ridersFee: Number(ridersFee).toFixed(2),
      isEvent,
      userName: locals.firstName,
      note: note ? note : "",
      serviceCharge: Number(serviceCharge).toFixed(2),
      orderDate: new Date(),
      netAmount: Number(netAmount).toFixed(2),
      totalAmount: Number(totalSum).toFixed(2),
      startDate,
      endDate,
      startTime,
      endTime,
      eventDescription,
      daysOfEvent,
      eventLocation,
      isBulk,
      schedule,
    })

    if (!currentOrder)
      return { success: false, msg: orderMessages.ORDER_FAILURE }

    return {
      success: true,
      msg: `Order successful. Vendor will review your order`,
      data: currentOrder,
    }
  }

  //schedule order evaluation
  static async evaluateScheduleOrderService(
    orderPayload: {
      vendorId: string
      isEvent?: boolean
      isBulk?: boolean
      daysOfEvent?: number
      lng?: any
      lat?: any
      scheduleDays: IWeek[]
      note?: string
      pickUp?: boolean
      deliveryAddress: string
      startDate?: Date
      endDate?: Date
      startTime?: string
      endTime?: string
      eventDescription?: string
      eventLocation?: string
      schedule: boolean
    },
    locals: any,
  ): Promise<IResponse> {
    const {
      vendorId,
      lng,
      lat,
      scheduleDays,
      note,
      deliveryAddress,
      pickUp,
      isEvent,
      isBulk,
      startDate,
      endDate,
      startTime,
      endTime,
      eventDescription,
      daysOfEvent,
      eventLocation,
      schedule,
    } = orderPayload

    if (!schedule)
      return { success: false, msg: "Schedule key must always be true" }

    let kilometers: any

    const vendor = await VendorRepository.fetchVendor(
      {
        _id: new mongoose.Types.ObjectId(vendorId),
      },
      {},
    )
    if (!vendor) return { success: false, msg: partnerMessages.VENDOR_ERROR }
    let randomOrderId = `#${AlphaNumeric(4, "number")}`
    let existingOrderCode = await OrderRepository.fetchOrder(
      {
        orderId: randomOrderId,
      },
      {},
    )
    while (existingOrderCode) {
      randomOrderId = AlphaNumeric(4, "number")
      existingOrderCode = await OrderRepository.fetchOrder(
        {
          orderId: randomOrderId,
        },
        {},
      )
    }
    const customer = await UserRepository.fetchUser(
      { _id: new mongoose.Types.ObjectId(locals._id) },
      {},
    )
    if (!customer) return { success: false, msg: `unable to identify customer` }
    let ridersFee
    let vendorLng: any
    let vendorLat: any

    if (deliveryAddress) {
      if (vendor?.locationCoord && vendor?.locationCoord?.coordinates) {
        vendorLng = vendor?.locationCoord?.coordinates[0]
        vendorLat = vendor?.locationCoord?.coordinates[1]
      } else {
        return {
          success: false,
          msg: "Location coordinates not available for the vendor.",
        }
      }

      const R = 6371.0
      const lat1Rad: any = deg2rad(vendorLat)
      const lon1Rad: any = deg2rad(vendorLng)
      const lat2Rad: any = deg2rad(lat)
      const lon2Rad: any = deg2rad(lng)

      const dLat = lat2Rad - lat1Rad
      const dLon = lon2Rad - lon1Rad
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) *
          Math.cos(lat2Rad) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c

      kilometers = distance.toFixed(2)
    }

    const allItems = await ItemRepository.findAllItems({})
    const result = scheduleDays.map((payloadWeek) => ({
      week: payloadWeek.name,
      days: payloadWeek.days.map((payloadDay) => {
        const breakfastItems =
          payloadDay.meals.breakfast?.map((meal) =>
            allItems.find((item) => item._id.toString() === meal._id),
          ) || []
        const lunchItems =
          payloadDay.meals.lunch?.map((meal) =>
            allItems.find((item) => item._id.toString() === meal._id),
          ) || []
        const dinnerItems =
          payloadDay.meals.dinner?.map((meal) =>
            allItems.find((item) => item._id.toString() === meal._id),
          ) || []

        return {
          date: payloadDay.date,
          meals: {
            breakfast: breakfastItems,
            lunch: lunchItems,
            dinner: dinnerItems,
          },
        }
      }),
    }))

    if (!result) return { success: false, msg: orderMessages.NOT_AVAILABLE }

    const netAmount: any = scheduleDays.reduce((total, currentWeek: any) => {
      const weekAmount = currentWeek.days.reduce(
        (weekTotal: any, currentDay: any) => {
          const breakfastAmount =
            currentDay.meals.breakfast?.reduce(
              (sum: any, meal: any) => sum + meal.price * meal.quantity,
              0,
            ) || 0
          const lunchAmount =
            currentDay.meals.lunch?.reduce(
              (sum: any, meal: any) => sum + meal.price * meal.quantity,
              0,
            ) || 0
          const dinnerAmount =
            currentDay.meals.dinner?.reduce(
              (sum: any, meal: any) => sum + meal.price * meal.quantity,
              0,
            ) || 0
          return weekTotal + breakfastAmount + lunchAmount + dinnerAmount
        },
        0,
      )
      return total + weekAmount
    }, 0)

    let serviceCharge
    let parsePickUpNumber
    let totalPrice: any
    let pickUpNumber

    try {
      pickUpNumber = RandomFourDigits()
      let existingCode = await OrderRepository.fetchOrder(
        {
          pickUpCode: pickUpNumber,
        },
        {},
      )
      while (existingCode) {
        pickUpNumber = RandomFourDigits()
        existingCode = await OrderRepository.fetchOrder(
          {
            pickUpCode: pickUpNumber,
          },
          {},
        )
      }
    } catch (error) {
      console.log("pick up code error", error)
    }

    if (deliveryAddress) {
      ridersFee = kilometers * 2
      const parseAmount: any = Number(netAmount)
      totalPrice = parseAmount
      serviceCharge = (10 * totalPrice) / 100
      parsePickUpNumber = Number(pickUpNumber)
    }

    if (pickUp) {
      ridersFee = 0
      const parseAmount: any = Number(netAmount)
      totalPrice = parseAmount
      serviceCharge = (10 * totalPrice) / 100
      parsePickUpNumber = Number(pickUpNumber)
    }

    if (isEvent) {
      ridersFee = 0
    }

    const totalSum: any = serviceCharge + totalPrice + ridersFee

    let location: any = {
      type: "Point",
      coordinates: [parseFloat("0"), parseFloat("0")],
    }

    if (lat && lng) {
      location = {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      }
    }

    let itemLength
    let totalDistance: number = kilometers

    if (schedule && !pickUp) {
      switch (schedule) {
        case true:
          let breakfastCount = 0
          let lunchCount = 0
          let dinnerCount = 0

          scheduleDays.forEach((payloadWeek) => {
            payloadWeek.days.forEach((payloadDay) => {
              breakfastCount += payloadDay.meals.breakfast?.length || 0
              lunchCount += payloadDay.meals.lunch?.length || 0
              dinnerCount += payloadDay.meals.dinner?.length || 0
            })
          })

          itemLength = breakfastCount + lunchCount + dinnerCount
          totalDistance = itemLength * kilometers
          break
        default:
          throw Error("Invalid schedule")
      }
    }
    if (pickUp && schedule) {
      switch (schedule && pickUp) {
        case true:
          itemLength = 0
          totalDistance = 0
          break

        default:
          throw Error("Invalid schedule and pick up")
      }
    }

    const currentOrder = await OrderRepository.createOrder({
      pickUpCode: parsePickUpNumber,
      orderId: randomOrderId,
      numberOfTrips: itemLength,
      totalDistance: Number(totalDistance),
      pickUp,
      deliveryAddress,
      scheduleDays: [...scheduleDays],
      orderedBy: new mongoose.Types.ObjectId(locals._id),
      vendorId: new mongoose.Types.ObjectId(vendor._id),
      locationCoord: location,
      userEmail: locals.email,
      ridersFee: Number(ridersFee).toFixed(2),
      isEvent,
      userName: locals.firstName,
      note: note ? note : "",
      serviceCharge: Number(serviceCharge).toFixed(2),
      orderDate: new Date(),
      netAmount: Number(netAmount).toFixed(2),
      totalAmount: Number(totalSum).toFixed(2),
      startDate,
      endDate,
      startTime,
      endTime,
      eventDescription,
      daysOfEvent,
      eventLocation,
      isBulk,
      schedule,
    })

    if (!currentOrder)
      return { success: false, msg: orderMessages.ORDER_FAILURE }

    return {
      success: true,
      msg: `Order successful. Vendor will review your order`,
      data: {
        week: currentOrder.scheduleDays,
        ridersFee: currentOrder.ridersFee,
        netAmount: currentOrder.netAmount,
        totalAmount: currentOrder.totalAmount,
        serviceCharge: currentOrder.serviceCharge,
        schedule: currentOrder.schedule,
      },
    }
  }

  static async riderScheduleItem(payload: string, locals: string) {
    //fetch order
    const order = await OrderRepository.fetchOrder(
      {
        _id: new mongoose.Types.ObjectId(payload),
        assignedRider: new mongoose.Types.ObjectId(locals),
      },
      {},
    )

    if (!order) return { success: false, msg: `Invalid orderId` }
    return { success: true, msg: `Schedule item fetched`, data: order.itemId }
  }

  static async fetchOrderService(payload: Partial<IOrder>, locals: any) {
    let { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Order",
    )

    if (error) return { success: false, msg: error }

    let extra = {}
    if (locals?.userType === "User") {
      extra = { orderedBy: new mongoose.Types.ObjectId(locals._id) }
    }

    if (locals?.userType === "Rider") {
      extra = { assignedRider: new mongoose.Types.ObjectId(locals._id) }
    }

    if (locals?.userType === "Partner") {
      extra = { vendorId: new mongoose.Types.ObjectId(locals.vendorId) }
    }

    if (locals?.userType === "Partner" && params.payment === "pending") {
      delete params.payment
      extra = {
        $and: [
          { orderStatus: { $ne: "pending" } },
          { orderStatus: { $ne: "completed" } },
          { orderStatus: { $ne: "cancelled" } },
        ],
        isConfirmed: true,
        vendorId: new mongoose.Types.ObjectId(locals.vendorId),
      }
    }

    if (locals?.userType === "Partner" && params.payment === "paid") {
      delete params.payment
      extra = {
        $and: [{ orderStatus: "completed" }],
        isConfirmed: true,
        vendorId: new mongoose.Types.ObjectId(locals.vendorId),
      }
    }

    let currentDate
    if (params.createdAt) {
      // Convert createdAt to a Date object
      const date = new Date(params.createdAt)

      currentDate = {
        createdAt: {
          $gte: new Date(date.setHours(0, 0, 0)),
          $lt: new Date(date.setHours(23, 59, 59)),
        },
      }
      delete params.createdAt
    }
    const order = await OrderRepository.fetchOrderByParams({
      ...params,
      ...extra,
      ...currentDate,
      limit,
      skip,
      sort,
    })

    if (order.length < 1)
      return { success: true, msg: orderMessages.NOT_FOUND, data: [] }

    return {
      success: true,
      msg: orderMessages.FETCH_SUCCESS,
      data: order,
    }
  }

  //update order
  static async updateOrderService(
    orderId: string,
    data: Partial<IOrder>,
    locals: string,
    isPartner: Boolean,
  ) {
    let { orderStatus, confirmDelivery, riderStatus } = data

    //check if order status is accepted and the order is paid for before going next
    if (orderStatus && orderStatus === "accepted") {
      const order = await OrderRepository.fetchOrder(
        { _id: new mongoose.Types.ObjectId(orderId), orderStatus: "pending" },
        {},
      )

      if ((order && order.paymentStatus !== "paid") || !order)
        return { success: false, msg: "Invalid order" }
    }

    if (data.orderStatus === "completed")
      return {
        success: false,
        msg: `Invalid updated payload`,
      }

    if (!isPartner) {
      if (orderStatus === "in-transit") {
        const findOrder = await OrderRepository.fetchOrder(
          { _id: new mongoose.Types.ObjectId(orderId) },
          {},
        )

        if (findOrder?.orderStatus !== "picked") {
          return { success: false, msg: `Order not currently picked` }
        }
      }
    }

    if (riderStatus && riderStatus === "arrived") {
      const findOrder = await OrderRepository.fetchOrder(
        {
          _id: new mongoose.Types.ObjectId(orderId),
          assignedRider: new mongoose.Types.ObjectId(locals),
        },
        {},
      )

      if (!findOrder) {
        return { success: false, msg: `Order not assigned to current rider` }
      }
    }

    const findOrder = await OrderRepository.fetchOrder(
      { _id: new mongoose.Types.ObjectId(orderId) },
      {},
    )

    if (!findOrder)
      return { success: false, msg: orderMessages.NOT_FOUND, data: [] }

    if (confirmDelivery) {
      const updateOrder = await OrderRepository.updateOrderDetails(
        {
          _id: new mongoose.Types.ObjectId(orderId),
          confirmDelivery: false,
          assignedRider: new mongoose.Types.ObjectId(locals),
          paymentStatus: "paid",
        },
        { confirmDelivery: true },
      )

      if (!updateOrder)
        return {
          success: false,
          msg: `Invalid order or duplicate confirmation`,
        }
    }

    await OrderRepository.updateOrderDetails(
      { _id: new mongoose.Types.ObjectId(findOrder._id) },
      { ...data },
    )

    if (orderStatus || riderStatus) {
      try {
        const [vendor, user] = await Promise.all([
          await VendorRepository.fetchVendor(
            {
              _id: new mongoose.Types.ObjectId(findOrder?.vendorId),
            },
            {},
          ),
          await UserRepository.fetchUser(
            {
              _id: new mongoose.Types.ObjectId(findOrder?.orderedBy),
            },
            {},
          ),
        ])

        if (user?.deviceId) {
          let userMessage: any = {
            to: `${user?.deviceId}`,
            sound: "default",
            title: "Order Update",
            body: riderStatus
              ? `Rider has ${riderStatus} for your order`
              : `Your order is now ${orderStatus}`,
          }

          await expo.sendPushNotificationsAsync([userMessage])
        }

        if (vendor?.deviceId) {
          let vendorMessage: any = {
            to: `${vendor?.deviceId}`,
            sound: "default",
            title: "Order Update",
            body: riderStatus
              ? `Rider has ${riderStatus} for your order`
              : `Your order is now ${orderStatus}`,
          }

          await expo.sendPushNotificationsAsync([vendorMessage])
        }

        await Promise.all([
          await NotificationRepository.createNotification({
            subject: "Order Update",
            message: riderStatus
              ? `Rider has ${riderStatus} for your order`
              : `Your order is now ${orderStatus}`,
            recipientId: new mongoose.Types.ObjectId(user?._id),
            recipient: "User",
          }),
          await NotificationRepository.createNotification({
            subject: "Order Update",
            message: riderStatus
              ? `Rider has ${riderStatus} for your order`
              : `Your order is now ${orderStatus}`,
            recipientId: new mongoose.Types.ObjectId(vendor?._id),
            recipient: "Vendor",
          }),
        ])
      } catch (error) {
        console.log("push error", error)
      }
    }

    return {
      success: true,
      msg: orderMessages.UPDATE_SUCCESS,
    }
  }

  //update schedule order
  static async updateScheduleOrderService(payload: {
    orderId: string
    day: string
    period: "breakfast" | "lunch" | "dinner"
    scheduleStatus: string
    locals: any
  }) {
    const { orderId, scheduleStatus, locals, day, period } = payload
    const { userType, _id, vendorId } = locals

    if (userType === "Rider") {
      let confirmOrder = await OrderRepository.fetchOrder(
        {
          _id: new mongoose.Types.ObjectId(orderId),
          paymentStatus: "paid",
          schedule: true,
          assignedRider: new mongoose.Types.ObjectId(_id),
        },
        {},
      )

      if (!confirmOrder)
        return {
          success: false,
          msg: `Schedule order not assigned to current rider`,
        }
    }

    if (userType === "Partner") {
      let setDate = new Date(day).toISOString()
      let confirmOrder = await OrderRepository.fetchOrder(
        {
          _id: new mongoose.Types.ObjectId(orderId),
          schedule: true,
          paymentStatus: "paid",
          "itemId.period": period,
          "itemId.day": setDate,
          vendorId: new mongoose.Types.ObjectId(vendorId),
        },
        {},
      )

      if (!confirmOrder)
        return {
          success: false,
          msg: `Invalid Schedule order`,
        }
    }

    let fetchOrder
    //check if schedule is picked
    if (scheduleStatus === "in-transit") {
      fetchOrder = await OrderRepository.fetchOrder(
        {
          _id: new mongoose.Types.ObjectId(orderId),
          paymentStatus: "paid",
          "itemId.scheduleStatus": "picked",
        },
        {},
      )

      if (!fetchOrder)
        return {
          success: false,
          msg: `Schedule item not picked or possible invalid order`,
        }
    }

    //check if schedule is completed
    if (scheduleStatus === "completed") {
      fetchOrder = await OrderRepository.fetchOrder(
        {
          _id: new mongoose.Types.ObjectId(orderId),
          paymentStatus: "paid",
          "itemId.scheduleStatus": scheduleStatus,
        },
        {},
      )

      if (!fetchOrder)
        return {
          success: false,
          msg: `Schedule item already completed or possible invalid order`,
        }
    }
    let setDate = new Date(day).toISOString()
    const order = await OrderRepository.updateManyOrderDetails(
      {
        _id: new mongoose.Types.ObjectId(orderId),
        paymentStatus: "paid",
        "itemId.period": period,
        "itemId.day": setDate,
      },
      {
        $set: {
          "itemId.$[elem].delivered": true,
          "itemId.$[elem].scheduleStatus": scheduleStatus,
        },
      },
      {
        arrayFilters: [{ "elem.period": period, "elem.day": setDate }],
      },
    )

    if (!order)
      return { success: false, msg: `Unable to update schedule status` }

    if (order) {
      try {
        const [vendor, user] = await Promise.all([
          await VendorRepository.fetchVendor(
            {
              _id: new mongoose.Types.ObjectId(fetchOrder?.vendorId),
            },
            {},
          ),
          await UserRepository.fetchUser(
            {
              _id: new mongoose.Types.ObjectId(fetchOrder?.orderedBy),
            },
            {},
          ),
        ])

        if (user?.deviceId) {
          let userMessage: any = {
            to: `${user?.deviceId}`,
            sound: "default",
            title: "Order Update",
            body: `Your order is now ${scheduleStatus}`,
          }

          await expo.sendPushNotificationsAsync([userMessage])
        }

        if (vendor?.deviceId) {
          let vendorMessage: any = {
            to: `${vendor?.deviceId}`,
            sound: "default",
            title: "Order Update",
            body: `Your order is now ${scheduleStatus}`,
          }

          await expo.sendPushNotificationsAsync([vendorMessage])
        }

        await Promise.all([
          await NotificationRepository.createNotification({
            subject: "Order Update",
            message: `Your order is now ${scheduleStatus}`,
            recipientId: new mongoose.Types.ObjectId(user?._id),
            recipient: "User",
          }),
          await NotificationRepository.createNotification({
            subject: "Order Update",
            message: `Your order is now ${scheduleStatus}`,
            recipientId: new mongoose.Types.ObjectId(vendor?._id),
            recipient: "Vendor",
          }),
        ])
      } catch (error) {
        console.log("push error", error)
      }
    }

    return {
      success: true,
      msg: orderMessages.UPDATE_SUCCESS,
    }
  }

  static async orderAnalysisService(payload: any, query: any) {
    const vendor = await VendorRepository.fetchVendor(
      { partnerId: new mongoose.Types.ObjectId(payload) },
      {},
    )
    if (!vendor) return { success: false, msg: `vendor not available` }
    let dateFilter
    if (query.timeFrame === "weekly") {
      dateFilter = {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      }
    } else if (query.timeFrame === "monthly") {
      dateFilter = {
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      }
    } else if (query.timeFrame === "yearly") {
      dateFilter = {
        createdAt: {
          $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        },
      }
    }

    const totalOrders = await OrderRepository.fetchAllOrders({
      vendorId: new mongoose.Types.ObjectId(vendor._id),
      isConfirmed: true,
      ...dateFilter,
    })

    const payment = await OrderRepository.fetchAllOrders({
      vendorId: new mongoose.Types.ObjectId(vendor._id),
      paymentStatus: "paid",
      orderStatus: "completed",
      isConfirmed: true,
      ...dateFilter,
    })

    const orderCompleted = await OrderRepository.fetchAllOrders({
      vendorId: new mongoose.Types.ObjectId(vendor._id),
      paymentStatus: "paid",
      orderStatus: "completed",
      isConfirmed: true,
      ...dateFilter,
    })
    const pendingOrders = await OrderRepository.fetchAllOrders({
      vendorId: new mongoose.Types.ObjectId(vendor._id),
      paymentStatus: "paid",
      orderStatus: "pending",
      isConfirmed: true,
      ...dateFilter,
    })

    const totalPayment = payment.reduce((accumulator, currentExpense) => {
      return accumulator + (Number(currentExpense.netAmount.valueOf()) || 0)
    }, 0)

    return {
      success: true,
      msg: orderMessages.FETCH_SUCCESS,
      data: {
        totalOrders: totalOrders.length,
        totalPayment: Number(totalPayment.toFixed(2)),
        orderCompleted: orderCompleted.length,
        pendingOrders: pendingOrders.length,
      },
    }
  }

  static async adminOrderAnalysisService() {
    const allOrders = await OrderRepository.fetchAllOrders({})
    const pendingOrders = await OrderRepository.fetchAllOrders({
      orderStatus: "pending",
    })
    const completedOrder = await OrderRepository.fetchAllOrders({
      orderStatus: "completed",
    })
    const cancelledOrder = await OrderRepository.fetchAllOrders({
      orderStatus: "cancelled",
    })

    const allPayment = allOrders.reduce((accumulator, currentExpense) => {
      return accumulator + (Number(currentExpense.totalAmount.valueOf()) || 0)
    }, 0)

    const pendingPayment = pendingOrders.reduce(
      (accumulator, currentExpense) => {
        return accumulator + (Number(currentExpense.totalAmount.valueOf()) || 0)
      },
      0,
    )

    const completedPayment = completedOrder.reduce(
      (accumulator, currentExpense) => {
        return accumulator + (Number(currentExpense.totalAmount.valueOf()) || 0)
      },
      0,
    )

    return {
      success: true,
      msg: orderMessages.FETCH_SUCCESS,
      data: {
        allPayment,
        pendingPayment,
        completedPayment,
        cancelledPayment: cancelledOrder.length,
      },
    }
  }

  static async adminDashboardAnalysis() {
    // Get the current date
    const currentDate = new Date()

    // Calculate the start and end dates of the previous month
    let startOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    )
    let endOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0,
    )

    // Fetch all orders and completed orders for the last month
    const allOrders = await OrderRepository.fetchAllOrders({
      createdAt: {
        $gte: startOfLastMonth,
        $lt: endOfLastMonth,
      },
    })

    const orderProcessed = await OrderRepository.fetchAllOrders({
      orderStatus: "completed",
      createdAt: {
        $gte: startOfLastMonth,
        $lt: endOfLastMonth,
      },
    })

    const totalAmount = allOrders.reduce((accumulator, currentExpense) => {
      return accumulator + (Number(currentExpense.totalAmount.valueOf()) || 0)
    }, 0)

    const totalServiceCharge = allOrders.reduce(
      (accumulator, currentExpense) => {
        return (
          accumulator + (Number(currentExpense.serviceCharge.valueOf()) || 0)
        )
      },
      0,
    )

    const netAmount = allOrders.reduce((accumulator, currentExpense) => {
      return accumulator + (Number(currentExpense.netAmount.valueOf()) || 0)
    }, 0)

    const totalAmounts = allOrders.map((order) => order.totalAmount)

    const averageTotalSales = totalAmount / totalAmounts.length

    const totalRevenue = totalAmount - netAmount

    const totalOrderProcessed = orderProcessed.length

    return {
      success: true,
      msg: orderMessages.FETCH_SUCCESS,
      data: {
        totalRevenue,
        averageTotalSales: Number(averageTotalSales).toFixed(2),
        totalOrderProcessed,
        totalServiceCharge: Number(totalServiceCharge).toFixed(2),
      },
    }
  }

  //admin cancelling order requested by customer or user
  static async adminCancellingOrder(payload: Pick<IOrder, "_id">) {
    const { _id } = payload
    const order = await OrderRepository.fetchOrder(
      { _id: new mongoose.Types.ObjectId(_id) },
      {},
    )
    if (!order) return { success: false, msg: `Invalid order id` }

    //check if order has not been accepted
    if (order && order.orderStatus !== "pending") {
      return { success: false, msg: `Order already accepted by vendor` }
    }

    //update order to cancel and refund buyers money to wallet
    const updateOrder = await OrderRepository.updateOrderDetails(
      {
        _id: new mongoose.Types.ObjectId(order._id),
      },
      { orderStatus: "cancelled", vendorId: null },
    )

    if (!updateOrder) return { success: false, msg: `Unable to cancel order` }

    try {
      //get user
      const userWallet = await UserRepository.fetchUser(
        { _id: new mongoose.Types.ObjectId(order.orderedBy) },
        {},
      )

      const increaseWallet =
        Number(userWallet?.wallet) + Number(order.totalAmount).toFixed(2)

      const user = await UserRepository.updateUsersProfile(
        {
          _id: new mongoose.Types.ObjectId(order.orderedBy),
        },
        { wallet: Number(increaseWallet).toFixed(2) },
      )

      if (user?.deviceId) {
        let userMessage: any = {
          to: `${user?.deviceId}`,
          sound: "default",
          title: "Cancelled order fee revert",
          body: `Hi, your request to cancel order is successful. Your ${order.totalAmount} order fee is been added to your wallet`,
        }

        await expo.sendPushNotificationsAsync([userMessage])
      }

      await NotificationRepository.createNotification({
        subject: "Cancelled order fee revert",
        message: `Hi, your request to cancel order is successful. Your ${order.totalAmount} order fee is been added to your wallet`,
        recipientId: new mongoose.Types.ObjectId(user?._id),
        recipient: "User",
      })
    } catch (error) {
      console.log("push error", error)
    }

    return { success: true, msg: `Order cancelled successfully` }
  }

  //fetch specific schedule item
  static async fetchSpecificScheduleItem(payload: any, params: string) {
    const { scheduleStatus, day, period } = payload

    if (!scheduleStatus || !day || !period) {
      return {
        success: true,
        msg: `Schedule status, day period cannot be empty`,
      }
    }
    // Parse the day field to a Date object
    let setDate = new Date(day).toISOString()
    //fetch order
    let order = await OrderRepository.fetchOrder(
      {
        _id: new mongoose.Types.ObjectId(params),
        schedule: true,
        paymentStatus: "paid",
        "itemId.period": period,
        "itemId.day": setDate,
        "itemId.scheduleStatus": scheduleStatus,
      },
      {},
    )

    if (!order) return { success: false, msg: `Schedule order not found` }

    const orderItem = order.itemId!
    // Extract matching itemId objects
    const matchingItems = orderItem.filter(
      (item: any) =>
        item.scheduleStatus === scheduleStatus &&
        new Date(item.day) &&
        item.period === period,
    )

    return { success: true, msg: `Schedule item fetched`, data: matchingItems }
  }

  static async fetchScheduleItemForDay(params: string) {
    // Set the current date to the start of the day (00:00:00)
    let setDate = new Date()
    setDate.setHours(0, 0, 0, 0)

    // Fetch the order
    let order = await OrderRepository.fetchOrder(
      {
        _id: new mongoose.Types.ObjectId(params),
        schedule: true,
      },
      {},
    )

    if (!order) return { success: false, msg: `Schedule order not found` }

    let orderItems = order.itemId || []

    let itemDate
    // Extract matching itemId objects by comparing only the date parts
    const matchingItems = orderItems.filter((item: any) => {
      itemDate = new Date(item.day)
      itemDate.setHours(0, 0, 0, 0)
      return itemDate.getTime() === setDate.getTime()
    })

    return {
      success: true,
      msg: `Schedule item fetched`,
      day: orderItems[0]?.day,
      data: orderItems,
    }
  }

  //get weekly schedule item
  static async fetchWeeklySchedule(params: string) {
    // Fetch the order
    let order = await OrderRepository.fetchOrder(
      {
        _id: new mongoose.Types.ObjectId(params),
        schedule: true,
        isConfirmed: true,
        paymentStatus: "paid"
      },
      {},
    )

    if (!order)
      return { success: true, msg: `Schedule order not found`, data: [] }

    return {
      success: true,
      msg: `Schedule item fetched`,
      data: order.scheduleDays,
    }
  }
}
