import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema(
  {
    // Link to user account in MongoDB
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Original booking fields
    customer: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    eventType: { type: String, required: true },
    guests: { type: Number, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    package: { type: String, required: true },
    packageId: mongoose.Schema.Types.ObjectId,

    // Pricing / payment
    amount: { type: Number, required: true },
    price: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },

    // Status & additional info
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    specialRequests: { type: String, default: "" },
    customMenu: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema)
