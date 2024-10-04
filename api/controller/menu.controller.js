import Menu from "../models/menu.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({ message: "Api is working" });
};

export const createRecepie = async (req, res, next) => {
  const { name, description, price, image, restaurantid } = req.body;
  console.log(name, description, price, image, restaurantid);

  if (
    !name ||
    !description ||
    !price ||
    !image ||
    !restaurantid ||
    name === "" ||
    description === "" ||
    price === "" ||
    image === "" ||
    restaurantid === ""
  ) {
    return next(errorHandler(400, "All fields are required!!"));
  }

  const newMenu = new Menu({
    restaurantid,
    name,
    description,
    price,
    image,
  });

  try {
    await newMenu.save();
    const menu = await Menu.findOne({ name });
    res.json(menu._doc);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteRecepie = async (req, res, next) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.menuid);
    res.status(200).json("Recepie has been deleted");
  } catch (error) {
    next(error);
  }
};

export const fetchRecepie = async (req, res, next) => {
  console.log("get Menu called");
  const restaurantId = req.params.restaurantid;
  try {
    const menu = await Menu.find({ restaurantid: restaurantId });
    res.send(menu);
  } catch (error) {}
};
