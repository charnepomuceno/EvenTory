export const runtime = 'nodejs'

import { dbConnect, mongoose } from "../../../../lib/db.js";

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) return new Response("Missing id", { status: 400 });

    if (!process.env.MONGODB_URI) {
      return new Response('MONGODB_URI not configured', { status: 500 })
    }

    await dbConnect();

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });

    let _id;
    try {
      _id = new mongoose.Types.ObjectId(id);
    } catch (e) {
      return new Response("Invalid id", { status: 400 });
    }

    const filesColl = mongoose.connection.db.collection("uploads.files");
    const fileDoc = await filesColl.findOne({ _id });
    if (!fileDoc) return new Response("Not found", { status: 404 });

    const downloadStream = bucket.openDownloadStream(_id);
    const buffer = await streamToBuffer(downloadStream);

    const headers = new Headers({
      "Content-Type": fileDoc.contentType || "application/octet-stream",
      "Content-Length": String(buffer.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    });

    return new Response(buffer, { status: 200, headers });
  } catch (e) {
    console.error("Download error:", e);
    return new Response("Server error", { status: 500 });
  }
}
