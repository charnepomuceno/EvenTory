import mongoose from "mongoose"

const PaymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    customer: { type: String, required: true },
    event: { type: String, required: true },
    eventDate: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balance: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Partially Paid", "Fully Paid"], default: "Pending" },
    paymentMethod: {
      type: String,
      enum: ["credit-card", "debit-card", "bank-transfer", "gcash"],
      default: "gcash",
    },
  },
  { timestamps: true },
)

export const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)
