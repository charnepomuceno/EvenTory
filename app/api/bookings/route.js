import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const isAdmin = searchParams.get("isAdmin") === "true"

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })

    if (!isAdmin && userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching bookings:", error)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    return NextResponse.json({ bookings: data || [] })
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
    } = body

    if (!userId || !fullName || !email || !phone || !eventType || !numberOfGuests || !eventDate || !eventLocation || !preferredPackage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: userId,
          full_name: fullName,
          email,
          phone,
          event_type: eventType,
          number_of_guests: parseInt(numberOfGuests),
          event_date: eventDate,
          event_location: eventLocation,
          preferred_package: preferredPackage,
          special_requests: specialRequests || "",
          status: "pending",
          price: price || "0",
          paid: "0",
        },
      ])
      .select()

    if (error) {
      console.error("Error creating booking:", error)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    return NextResponse.json({ booking: data[0] }, { status: 201 })
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
