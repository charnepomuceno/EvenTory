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
      enum: ["Casual", "Formal", "Social", "Professional"],
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
    inclusions: [
      {
        type: String,
        default: "",
      },
    ],
    mainDish: [
      {
        type: String,
        default: "",
      },
    ],
    appetizer: [
      {
        type: String,
        default: "",
      },
    ],
    dessert: [
      {
        type: String,
        default: "",
      },
    ],
    beverage: [
      {
        type: String,
        default: "",
      },
    ],
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
)

const Package = mongoose.models.Package || mongoose.model("Package", packageSchema)
export default Package
