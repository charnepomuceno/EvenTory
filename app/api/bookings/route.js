import { Booking } from "@/lib/models/admin-booking"
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

    const bookings = await Booking.find(query).sort({ createdAt: -1 })
    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
  await dbConnect()
    const body = await request.json()

    // Calculate balance
    body.balance = body.totalAmount - (body.paidAmount || 0)

    const booking = new Booking(body)
    await booking.save()

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
