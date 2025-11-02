import dbConnect from "@/lib/db"
import Package from "@/lib/models/admin-package.js"

// GET all packages
export async function GET(request) {
  try {
    await dbConnect()
    const packages = await Package.find({}).sort({ createdAt: -1 })
    return Response.json({ success: true, data: packages })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST create a new package
export async function POST(request) {
  try {
    await dbConnect()
    const body = await request.json()

    const pkg = await Package.create(body)
    return Response.json({ success: true, data: pkg }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 })
  }
}
