import mongoose, { Schema } from "mongoose"

const bookingSchema = new Schema(
  {
    customer: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    eventType: { type: String, required: true },
    guests: { type: Number, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    package: { type: String, required: true },
    amount: { type: Number, required: true },
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    status: { type: String, default: "Pending" },
    customMenu: { type: Boolean, default: false },
    notes: { type: String, default: "" }
  },
  {
    timestamps: true
  }
)

export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema)
