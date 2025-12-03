import { Payment } from "@/lib/models/admin-payment.js"
import dbConnect from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const customer = searchParams.get("customer")

    const query = {}
    if (status) query.status = status
    if (customer) query.customer = { $regex: customer, $options: "i" }

    const payments = await Payment.find(query).populate("bookingId").sort({ createdAt: -1 })

    const visiblePayments = payments.filter((payment) => {
      const bookingStatus = payment.bookingId?.status
      if (!bookingStatus) return true
      return bookingStatus === "confirmed" || bookingStatus === "completed"
    })

    return NextResponse.json(visiblePayments)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const body = await request.json()

    const payment = new Payment(body)
    await payment.save()

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
