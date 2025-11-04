import { mongoose } from "../db.js"

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: ["Main Dish", "Dessert", "Beverage", "Appetizer", "Side Dish"],
    },
    cost: {
      type: Number,
      required: [true, "Please add a cost"],
      min: 0,
    },
    price: {
      type: Number,
      required: [true, "Please add a selling price"],
      min: 0,
    },
    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
  },
  { timestamps: true },
)

// Calculate profit
itemSchema.virtual("profit").get(function () {
  return this.price - this.cost
})

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema)
export default Item
