import dbConnect from "@/lib/db"
import Item from "@/lib/models/admin-item.js"

export async function GET(request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    let query = {}
    if (search) {
      query = {
        $or: [{ name: { $regex: search, $options: "i" } }, { category: { $regex: search, $options: "i" } }],
      }
    }

    const items = await Item.find(query).sort({ createdAt: -1 })
    return Response.json({ success: true, data: items })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const body = await request.json()

    const item = await Item.create(body)
    return Response.json({ success: true, data: item }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 })
  }
}
