import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"
import { Booking } from "@/lib/models/admin-booking"
import { Payment } from "@/lib/models/admin-payment"

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const isAdmin = searchParams.get("isAdmin") === "true"

    await dbConnect()

    const query = {}
    if (!isAdmin && userId) {
      query.userId = userId
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 })

    return NextResponse.json({ bookings: bookings.map(serializeBooking) })
  } catch (error) {
    console.error("Bookings fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      userId,
      fullName,
      email,
      phone,
      eventType,
      numberOfGuests,
      eventDate,
      eventLocation,
      preferredPackage,
      specialRequests,
      price,
      paymentMethod,
    } = body

    if (
      !userId ||
      !fullName ||
      !email ||
      !phone ||
      !eventType ||
      !numberOfGuests ||
      !eventDate ||
      !eventLocation ||
      !preferredPackage
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign up or log in to book an event." },
        { status: 401 },
      )
    }

    const guests = Number.parseInt(numberOfGuests, 10)

    let numericPrice = 0
    if (typeof price === "number") {
      numericPrice = price
    } else if (typeof price === "string") {
      const cleaned = price.replace(/[^0-9.]/g, "")
      numericPrice = cleaned ? Number(cleaned) : 0
    }

    const bookingData = {
      userId,
      customer: fullName,
      email,
      phone,
      eventType,
      guests,
      date: eventDate,
      location: eventLocation,
      package: preferredPackage,
      amount: numericPrice,
      price: numericPrice,
      paid: 0,
      status: "pending",
      specialRequests: specialRequests || "",
    }

    const booking = await Booking.create(bookingData)

    try {
      const validPaymentMethods = ["credit-card", "debit-card", "bank-transfer", "gcash"]
      const selectedPaymentMethod = paymentMethod && validPaymentMethods.includes(paymentMethod) 
        ? paymentMethod 
        : "gcash"

      await Payment.create({
        bookingId: booking._id,
        customer: booking.customer,
        event: booking.eventType,
        eventDate: booking.date,
        totalAmount: booking.price ?? booking.amount ?? 0,
        paidAmount: 0,
        balance: booking.price ?? booking.amount ?? 0,
        status: "Pending",
        paymentMethod: selectedPaymentMethod,
      })
    } catch (paymentError) {
      console.error("Failed to create payment record for booking:", paymentError)
    }

    return NextResponse.json({ booking: serializeBooking(booking) }, { status: 201 })
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
