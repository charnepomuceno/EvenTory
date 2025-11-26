import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { Booking } from "@/lib/models/admin-booking"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    const booking = await Booking.findById(id)
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    const body = await request.json()
    const booking = await Booking.findByIdAndUpdate(id, body, { new: true })
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    const booking = await Booking.findByIdAndDelete(id)
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ message: "Booking deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
