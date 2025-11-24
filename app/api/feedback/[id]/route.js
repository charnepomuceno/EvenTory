import { Feedback } from "@/lib/models/admin-feedback.js"
import dbConnect from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    await dbConnect()
    const feedback = await Feedback.findById(params.id)

    if (!feedback) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(feedback)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()
    const body = await request.json()

    const feedback = await Feedback.findByIdAndUpdate(params.id, body, { new: true })

    if (!feedback) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(feedback)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    const feedback = await Feedback.findByIdAndDelete(params.id)

    if (!feedback) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ message: "Deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
