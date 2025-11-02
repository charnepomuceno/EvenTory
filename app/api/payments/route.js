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
    return NextResponse.json(payments)
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
