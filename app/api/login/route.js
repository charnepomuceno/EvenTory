import dbConnect from "@/lib/db"
import User from "@/lib/models/User"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    await dbConnect()

    const body = await request.json()
    const { credential, password, loginType } = body

    if (!credential || !password || !loginType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let user
    if (loginType === "phone") {
      user = await User.findOne({ phoneNumber: credential.trim() })
    } else {
      user = await User.findOne({ email: credential.trim() })
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
    }

    const adminEmails = ["rabad@gbox.adnu.edu.ph", "charnepomuceno@gbox.adnu.edu.ph"]
    const isAdmin = adminEmails.includes((user.email || "").toLowerCase()) || Boolean(user.isAdmin)

    if (isAdmin && !user.isAdmin) {
      user.isAdmin = true
      await user.save()
    }

    return NextResponse.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        registrationType: user.registrationType,
        isAdmin,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
