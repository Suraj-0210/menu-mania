import Restaurant from "../models/restaurant.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({ message: "Api is working" });
};

export const createRestaurant = async (req, res, next) => {
  const { user_id, restaurantname, address, logo } = req.body;

  if (
    !user_id ||
    !restaurantname ||
    !address ||
    !logo ||
    user_id === "" ||
    restaurantname === "" ||
    address === "" ||
    logo === ""
  ) {
    next(errorHandler(400, "All fields are required!!"));
  }

  const newRestaurant = new Restaurant({
    user_id,
    restaurantname,
    address,
    logo,
  });

  try {
    await newRestaurant.save();
    const restaurant = await Restaurant.findOne({ user_id });
    res.json(restaurant._doc);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteRestaurant = async (req, res, next) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.restaurantid);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const fetchRestaurants = async (req, res, next) => {
  console.log("get Restaurant called");
  try {
    const restaurant = await Restaurant.find({ user_id: req.params.user_id });
    res.send(restaurant);
  } catch (error) {}
};
