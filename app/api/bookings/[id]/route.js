import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, price, paid } = body

    if (!status && !price && !paid) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const updateData = { updated_at: new Date().toISOString() }
    if (status) updateData.status = status
    if (price) updateData.price = price
    if (paid) updateData.paid = paid

    const { data, error } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating booking:", error)
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({ booking: data[0] })
  } catch (error) {
    console.error("Booking update error:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting booking:", error)
      return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
    }

    return NextResponse.json({ message: "Booking deleted successfully" })
  } catch (error) {
    console.error("Booking deletion error:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}
