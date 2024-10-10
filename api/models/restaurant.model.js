import mongoose from "mongoose";

const restaurantsSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    restaurantname: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default:
        "https://media.istockphoto.com/id/981368726/vector/restaurant-food-drinks-logo-fork-knife-background-vector-image.webp?s=2048x2048&w=is&k=20&c=PBbdXEXWkg1lq-U8c1Jxt0JbeNWCRtf-elsn3Ncew8M=",
    },
    tables: {
      type: Number, // Defining 'tables' as a number type
      required: true, // This field is now mandatory
      default: 1, // You can set a default number of tables, if desired
      min: 1, // Ensures there is at least 1 table in the restaurant
    },
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantsSchema);

export default Restaurant;
