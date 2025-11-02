import mongoose from "mongoose"

const FeedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    eventType: { type: String, required: true },
    date: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, required: true },
    status: { type: String, enum: ["Visible", "Hidden"], default: "Visible" },
  },
  { timestamps: true },
)

export const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema)
