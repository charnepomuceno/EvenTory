import dbConnect from "@/lib/db"
import User from "@/lib/models/User"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    await dbConnect()

    const body = await request.json()
    const { fullName, phoneNumber, email, password, registrationType } = body

    if (!fullName || !password || !registrationType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (registrationType === "phone") {
      if (!phoneNumber || phoneNumber.trim() === "") {
        return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
      }
      const existingUser = await User.findOne({ phoneNumber: phoneNumber.trim() })
      if (existingUser) {
        return NextResponse.json({ error: "Phone number already registered" }, { status: 400 })
      }
    } else {
      if (!email || email.trim() === "") {
        return NextResponse.json({ error: "Email is required" }, { status: 400 })
      }
      const existingUser = await User.findOne({ email: email.trim() })
      if (existingUser) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userData = {
      fullName: fullName.trim(),
      password: hashedPassword,
      registrationType,
    }

    if (registrationType === "phone") userData.phoneNumber = phoneNumber.trim()
    if (registrationType === "email") userData.email = email.trim()

    const newUser = new User(userData)

    await newUser.save()

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          phoneNumber: newUser.phoneNumber,
          email: newUser.email,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
