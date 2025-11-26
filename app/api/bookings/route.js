import { NextResponse } from "next/server"

let bookings = []

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const customer = searchParams.get("customer")

    let filtered = bookings

    if (status) {
      filtered = filtered.filter((b) => b.status?.toLowerCase() === status.toLowerCase())
    }

    if (customer) {
      filtered = filtered.filter(
        (b) =>
          b.customer?.toLowerCase().includes(customer.toLowerCase()) ||
          b.email?.toLowerCase().includes(customer.toLowerCase())
      )
    }

    return NextResponse.json(
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const newBooking = {
      _id: Date.now().toString(),
      ...body,
      status: body.status || "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    bookings.push(newBooking)

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error("Booking POST Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export function getBookings() {
  return bookings
}

export function setBookings(newBookings) {
  bookings = newBookings
}
