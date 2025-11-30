// Use Node runtime for GridFS + mongoose on Vercel
export const runtime = 'nodejs'

import { dbConnect, mongoose } from "../../../lib/db.js";

function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export async function POST(request) {
  try {
    if (!process.env.MONGODB_URI) {
      return Response.json({ success: false, error: "MONGODB_URI not configured" }, { status: 500 })
    }

    const form = await request.formData();
    const file = form.get("image");
    if (!file) {
      return Response.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const originalName = file.name || `upload-${Date.now()}`;
    const safeName = sanitizeName(originalName);
    const finalName = `${Date.now()}-${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await dbConnect();

    try {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });

      const uploadStream = bucket.openUploadStream(finalName, {
        contentType: file.type || "application/octet-stream",
      });

      await new Promise((resolve, reject) => {
        uploadStream.end(buffer, (err) => {
          if (err) return reject(err);
        });
        uploadStream.on("finish", () => resolve());
        uploadStream.on("error", (e) => reject(e));
      });

      const fileId = uploadStream.id.toString();
      const publicUrl = `/api/uploads/${fileId}`;
      return Response.json({ success: true, url: publicUrl }, { status: 201 });
    } catch (e) {
      console.error('GridFS write error:', e)
      return Response.json({ success: false, error: 'Failed to save file to DB' }, { status: 500 })
    }
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
