import mongoose, { Schema, model } from "mongoose"
import cron from "node-cron"
import { IDay, IMeal, IMeals, IOrder, IWeek } from "./order.interface"
import User from "../user/user.model"
import { Expo } from "expo-server-sdk"
const expo = new Expo()

// Define the Meal schema
const MealSchema = new Schema<IMeal>({
  quantity: { type: Number, required: true },
  _id: { type: mongoose.Types.ObjectId, ref: "Item" },
  price: { type: String, required: true },
  delivered: { type: String, default: false },
})

// Define the Meals schema
const MealsSchema = new Schema<IMeals>({
  breakfast: [MealSchema],
  lunch: [MealSchema],
  dinner: [MealSchema],
})

// Define the Day schema
const DaySchema = new Schema<IDay>({
  date: { type: Date, required: true },
  meals: { type: MealsSchema },
})

// Define the Week schema
const WeekSchema = new Schema<IWeek>({
  name: { type: String, required: true },
  days: [DaySchema],
})

const OrderSchema = new Schema<IOrder>(
  {
    pickUpCode: { type: Number },
    numberOfTrips: { type: Number, default: 1 },
    daysOfEvent: { type: Number },
    assignedRider: { type: mongoose.Types.ObjectId, ref: "Rider" },
    orderId: { type: String },
    pickUp: { type: Boolean, default: false },
    isSocket: { type: Boolean, default: false },
    isWallet: { type: Boolean, default: false },
    isEvent: { type: Boolean, default: false },
    isBulk: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    deliveryAddress: { type: String },
    delivered: { type: Boolean, default: false },
    note: { type: String },
    isAfrilish: { type: Boolean },
    itemId: [
      {
        _id: { type: mongoose.Types.ObjectId, ref: "Item" },
        quantity: { type: Number },
        price: { type: Number },
        day: { type: Date },
        date: { type: Date },
        period: { type: String },
        preferredTime: { type: String },
        delivered: { type: Boolean, default: false },
        scheduleStatus: {
          type: String,
          enum: [
            "pending",
            "ready",
            "accepted",
            "on-going",
            "in-transit",
            "ready",
            "arrived",
            "cancelled",
            "picked",
            "completed",
          ],
          default: "pending",
        },
      },
    ],
    scheduleDays: [WeekSchema],
    transactionId: { type: mongoose.Types.ObjectId, ref: "Transaction" },
    scheduleId: { type: mongoose.Types.ObjectId, ref: "Subscription" },
    orderedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    vendorId: { type: mongoose.Types.ObjectId, ref: "Vendor" },
    userEmail: { type: String },
    userName: { type: String },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "on-going",
        "in-transit",
        "ready",
        "arrived",
        "cancelled",
        "picked",
        "completed",
      ],
      default: "pending",
    },
    riderStatus: {
      type: String,
      enum: ["arrived"],
    },
    orderDate: { type: Date },
    dateRange: {
      startDay: { type: String },
      endDay: { type: String },
    },
    totalDistance: { type: Number, default: 0 },
    endDate: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    schedule: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
      default: "pending",
    },
    isDelete: { type: Boolean, default: false },
    paymentResponse: { type: String },
    ridersFee: { type: String },
    netAmount: { type: String },
    totalAmount: { type: String },
    serviceCharge: { type: String },
    confirmDelivery: { type: Boolean, default: false },
    remarks: { type: String },
    isConfirmed: { type: Boolean, default: false },
    delivery: { type: Boolean },
    readyTime: { type: String },
    paymentIntentId: { type: String },
    eventDescription: { type: String },
    eventLocation: { type: String },
    locationCoord: {
      type: { type: String },
      coordinates: [],
    },
  },
  { timestamps: true },
)

OrderSchema.index({ locationCoord: "2dsphere" })

const order = model<IOrder>("Order", OrderSchema, "order")

// Define a cron job to run every day at a specific time (e.g., midnight)
cron.schedule("0 0 * * *", async () => {
  try {
    // Calculate the date 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Delete orders where isConfirmed is false and createdAt is before sevenDaysAgo
    const result = await order.deleteMany({
      isConfirmed: false,
      createdAt: { $lt: sevenDaysAgo },
    })

    console.log(`Deleted ${result.deletedCount} orders older than 7 days.`)
  } catch (error) {
    console.error("Error deleting orders:", error)
  }
})

// Define a cron job to run every minute to check for late orders
cron.schedule("* * * * *", async () => {
  try {
    // Calculate the date and time 50 minutes ago
    const fortyMinutesAgo = new Date()
    fortyMinutesAgo.setMinutes(fortyMinutesAgo.getMinutes() - 40)

    // Find orders where orderStatus is "ready", pickUp is true, and updatedAt is before fortyMinutesAgo
    const lateOrders = await order.find({
      orderStatus: "ready",
      pickUp: true,
      schedule: false,
      paymentStatus: "paid",
      updatedAt: { $lte: fortyMinutesAgo },
    })

    if (lateOrders.length > 0) {
      lateOrders.forEach(async (order) => {
        const user = await User.findOne({
          _id: new mongoose.Types.ObjectId(order.orderedBy),
        })
        if (user && user?.deviceId) {
          let userMessage: any = {
            to: `${user?.deviceId}`,
            sound: "default",
            title: "Order Reminder",
            body: "Hi, you have 10 minutes left to pick up your order",
          }
          await expo.sendPushNotificationsAsync([userMessage])
        }
      })
    }
  } catch (error) {
    console.error("Error checking late orders:", error)
  }
})

// Define a cron job to run every hour to check for specific orders
cron.schedule("0 * * * *", async () => {
  try {
    const twentyTwoHoursAgo = new Date()
    twentyTwoHoursAgo.setHours(twentyTwoHoursAgo.getHours() - 22)

    const lateOrders = await order.find({
      $or: [
        {
          orderStatus: "ready",
          schedule: false,
          isEvent: true,
          pickUp: true,
          updatedAt: { $lte: twentyTwoHoursAgo },
          paymentStatus: "paid",
        },
        {
          orderStatus: "ready",
          isBulk: true,
          schedule: false,
          pickUp: true,
          updatedAt: { $lte: twentyTwoHoursAgo },
          paymentStatus: "paid",
        },
      ],
    })

    if (lateOrders.length > 0) {
      lateOrders.forEach(async (order) => {
        const user = await User.findOne({
          _id: new mongoose.Types.ObjectId(order.orderedBy),
        })
        if (user && user?.deviceId) {
          let userMessage: any = {
            to: `${user?.deviceId}`,
            sound: "default",
            title: "Order Reminder",
            body: "Hi, you have 1 hour left to pick up your order",
          }
          await expo.sendPushNotificationsAsync([userMessage])
        }
      })
    }
  } catch (error) {
    console.error("Error checking specific orders:", error)
  }
})

export default order
