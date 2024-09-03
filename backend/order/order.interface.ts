export interface IOrder {
  _id?: any
  assignedRider: any
  pickUpCode: Number
  daysOfEvent: Number
  orderId: string
  pickUp: Boolean
  totalDistance: Number
  isWallet: Boolean
  dateRange: {
    startDay: { type: string }
    endDay: { type: string }
  }
  isEvent: Boolean
  isBulk: Boolean
  delivered: Boolean
  isConfirmed: Boolean
  delivery: Boolean
  schedule: Boolean
  numberOfTrips: Number
  note: string
  isSocket: Boolean
  deliveryAddress: string
  itemId: [
    {
      _id: any
      quantity: Number
      price: Number
      day?: Date
      date?: Date
      period?: "breakfast" | "lunch" | "dinner"
      preferredTime?: string
      delivered?: Boolean
      scheduleStatus?: string
      isAfrilish?: Boolean
    },
  ]
  scheduleName: string
  scheduleDays: IWeek[]
  orderedBy: any
  vendorId: any
  totalAmount: string
  deliveryFee: Number
  userEmail: string
  userName: string
  paymentStatus: "paid" | "pending" | "failed"
  orderDate: Date
  startDate: Date
  startTime: string
  endTime: string
  endDate: Date
  paymentResponse: string
  ridersFee: string
  netAmount: string
  serviceCharge: string
  riderStatus: "arrived"
  orderStatus:
    | "pending"
    | "accepted"
    | "on-going"
    | "in-transit"
    | "ready"
    | "arrived"
    | "delivered"
    | "cancelled"
    | "picked"
    | "completed"
  confirmDelivery: Boolean
  remarks: string
  isDelete: boolean
  transactionId: any
  scheduleId: any
  readyTime: string
  eventDescription: string
  eventLocation: string
  rating: Number
  isAfrilish?: Boolean
  paymentIntentId: string
  status: "accepted" | "rejected" | "pending"
  locationCoord?: ILocation
  createdAt?: Date
  updatedAt?: Date
}

interface ILocation {
  type?: string
  coordinates?: [Number, Number]
}

export type DayPayload = {
  breakfast: MealPayload
  lunch: MealPayload
  dinner: MealPayload
}

// Define the MealPayload type for better TypeScript type-checking
type MealPayload = {
  item: Array<{ _id: any; quantity: Number; price: Number }>
}

export interface IWeek {
  name: string
  days: IDay[]
}
export interface IDay {
  date: Date
  meals: IMeals
}
export interface IMeals {
  breakfast: IMeal[]
  lunch: IMeal[]
  dinner: IMeal[]
}

export interface IMeal {
  _id: any
  quantity: number
  price: string
  scheduleStatus?: string
  delivered?: Boolean
}
