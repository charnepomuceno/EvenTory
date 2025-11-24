import dbConnect from "@/lib/db"
import Package from "@/lib/models/admin-package.js"

// GET single package
export async function GET(request, { params }) {
  try {
    await dbConnect()
    const { id } = params

    const pkg = await Package.findById(id)
    if (!pkg) {
      return Response.json({ success: false, error: "Package not found" }, { status: 404 })
    }

    return Response.json({ success: true, data: pkg })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT update package
export async function PUT(request, { params }) {
  try {
    await dbConnect()
    const { id } = params
    const body = await request.json()

    const pkg = await Package.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!pkg) {
      return Response.json({ success: false, error: "Package not found" }, { status: 404 })
    }

    return Response.json({ success: true, data: pkg })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 })
  }
}

// DELETE package
export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    const { id } = params

    const pkg = await Package.findByIdAndDelete(id)
    if (!pkg) {
      return Response.json({ success: false, error: "Package not found" }, { status: 404 })
    }

    return Response.json({ success: true, data: {} })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
