import { Payment } from "@/lib/models/admin-payment.js"
import { Booking } from "@/lib/models/admin-booking"
import dbConnect from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    await dbConnect()
    const { id } = await params
    const payment = await Payment.findById(id).populate("bookingId")

    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()
    const { id } = await params
    const body = await request.json()

    const payment = await Payment.findByIdAndUpdate(id, body, { new: true })

    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 })

    try {
      if (payment.bookingId) {
        const { totalAmount, paidAmount } = payment
        const updateBooking = {}
        if (typeof totalAmount === "number") {
          updateBooking.price = totalAmount
          updateBooking.amount = totalAmount
        }
        if (typeof paidAmount === "number") {
          updateBooking.paid = paidAmount
        }

        if (Object.keys(updateBooking).length > 0) {
          await Booking.findByIdAndUpdate(payment.bookingId, { $set: updateBooking })
        }
      }
    } catch (syncError) {
      console.error("Failed to sync booking with payment update:", syncError)
    }

    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    const { id } = await params
    const payment = await Payment.findByIdAndDelete(id)

    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ message: "Deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
