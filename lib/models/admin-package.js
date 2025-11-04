import { mongoose } from "../db.js"

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a package name"],
      trim: true,
    },
    tier: {
      type: String,
      required: [true, "Please add a tier"],
      enum: ["Premium", "Popular", "Business"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    guests: {
      type: String,
      required: [true, "Please add guest range"],
    },
    price: {
      type: String,
      required: [true, "Please add a price range"],
    },
    items: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true },
)

const Package = mongoose.models.Package || mongoose.model("Package", packageSchema)
export default Package
