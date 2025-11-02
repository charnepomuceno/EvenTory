import { Payment } from "@/lib/models/admin-payment.js"
import dbConnect from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    await dbConnect()
    const payment = await Payment.findById(params.id).populate("bookingId")

    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()
    const body = await request.json()

    const payment = await Payment.findByIdAndUpdate(params.id, body, { new: true })

    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    const payment = await Payment.findByIdAndDelete(params.id)

    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ message: "Deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
