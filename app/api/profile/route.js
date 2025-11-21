import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { userId, fullName, email, phoneNumber } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        email,
        phoneNumber,
        updatedAt: new Date(),
      },
      { new: true },
    )

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        phoneNumber: updatedUser.phoneNumber,
        email: updatedUser.email,
        registrationType: updatedUser.registrationType,
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
