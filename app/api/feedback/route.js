import { Feedback } from "@/lib/models/admin-feedback.js"
import dbConnect from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const rating = searchParams.get("rating")

    const query = {}
    if (status) query.status = status
    if (rating) query.rating = Number.parseInt(rating)

    const feedback = await Feedback.find(query).sort({ createdAt: -1 })
    return NextResponse.json(feedback)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const body = await request.json()

    const feedback = new Feedback(body)
    await feedback.save()

    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
