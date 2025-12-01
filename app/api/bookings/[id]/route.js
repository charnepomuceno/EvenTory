import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { Booking } from "@/lib/models/admin-booking"

// Keep in sync with serializeBooking in app/api/bookings/route.js
function serializeBooking(booking) {
  return {
    id: booking._id.toString(),
    user_id: booking.userId?.toString() || null,
    full_name: booking.customer,
    email: booking.email,
    phone: booking.phone,
    event_type: booking.eventType,
    number_of_guests: booking.guests,
    event_date: booking.date,
    event_location: booking.location,
    preferred_package: booking.package,
    special_requests: booking.specialRequests || "",
    status: booking.status,
    price: booking.price ?? booking.amount ?? 0,
    paid: booking.paid ?? 0,
    created_at: booking.createdAt,
    updated_at: booking.updatedAt,
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, price, paid } = body

    if (!status && price === undefined && paid === undefined) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    await dbConnect()

    const updateData = {}
    if (status) {
      // Map frontend status to stored status (same values currently)
      updateData.status = status
    }
    if (price !== undefined) updateData.price = Number(price)
    if (paid !== undefined) updateData.paid = Number(paid)

    const booking = await Booking.findByIdAndUpdate(id, updateData, { new: true })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({ booking: serializeBooking(booking) })
  } catch (error) {
    console.error("Booking update error:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    await dbConnect()

    const deleted = await Booking.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Booking deleted successfully" })
  } catch (error) {
    console.error("Booking deletion error:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}
