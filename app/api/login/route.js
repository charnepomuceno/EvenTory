import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { credential, password, loginType } = body

    if (!credential || !password || !loginType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let user
    if (loginType === "phone") {
      user = await User.findOne({ phoneNumber: credential })
    } else {
      user = await User.findOne({ email: credential })
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        registrationType: user.registrationType,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
