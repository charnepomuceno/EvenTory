import { Booking } from "@/lib/models/admin-booking"
import dbConnect from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
  await dbConnect()
    const { id } = await params
    const booking = await Booking.findById(id)

    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
  await dbConnect()
    const { id } = await params
    const body = await request.json()

    if (body.paidAmount !== undefined && body.totalAmount) {
      body.balance = body.totalAmount - body.paidAmount
      if (body.paidAmount === 0) body.status = "Pending"
      else if (body.paidAmount < body.totalAmount) body.status = "Partially Paid"
      else if (body.paidAmount >= body.totalAmount) body.status = "Fully Paid"
    }

    const booking = await Booking.findByIdAndUpdate(id, body, { new: true })

    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
  await dbConnect()
    const { id } = await params
    const booking = await Booking.findByIdAndDelete(id)

    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ message: "Deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
