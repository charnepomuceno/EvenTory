import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    eventType: { type: String, required: true },
    guests: { type: Number, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    package: { type: String, required: true },
    packageId: mongoose.Schema.Types.ObjectId,
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Completed"], default: "Pending" },
    customMenu: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema)
