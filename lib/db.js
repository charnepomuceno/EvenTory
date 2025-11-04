import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Define MONGODB_URI in your environment variables");
}

let isConnected = false;

export default async function dbConnect() {
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(MONGODB_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("Connected to MongoDB!");
    } catch (e) {
        console.error("MongoDB connection error:", e);
        throw e;
    }
}

// Export mongoose for use in models
export { mongoose };
