import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get("image");
    if (!file) {
      return Response.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // file is a Blob / File-like
    const filename = file.name || `upload-${Date.now()}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    // sanitize filename
    const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const finalName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadsDir, finalName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${finalName}`;
    return Response.json({ success: true, url: publicUrl }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
