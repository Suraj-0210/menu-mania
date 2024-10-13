import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    restaurantid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: false,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    stock: {
      type: Number, // Field to store how much of the dish is available
      required: true,
      default: 0, // Default value for stock
    },
    category: {
      type: String, // Field to categorize the dish (e.g., Breakfast, Lunch, etc.)
      required: true,
    },
  },
  { timestamps: true }
);

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
