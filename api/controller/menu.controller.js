import Menu from "../models/menu.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({ message: "Api is working" });
};

export const createRecepie = async (req, res, next) => {
  const { name, description, price, image, stock, restaurantid, category } =
    req.body;
  console.log(name, description, price, image, restaurantid);

  if (
    !name ||
    !description ||
    !price ||
    !image ||
    !restaurantid ||
    !category ||
    !stock ||
    name === "" ||
    description === "" ||
    price === "" ||
    image === "" ||
    restaurantid === "" ||
    category === "" ||
    stock === ""
  ) {
    return next(errorHandler(400, "All fields are required!!"));
  }

  const newMenu = new Menu({
    restaurantid,
    name,
    description,
    price,
    image,
    category,
    stock,
  });

  try {
    const savedMenu = await newMenu.save();
    res.json(savedMenu._doc);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateRecepie = async (req, res, next) => {
  const { name, description, price, image, stock, category } = req.body;

  console.log(name, description, price, image, stock, category);

  if (
    !name ||
    !description ||
    !price ||
    !image ||
    !category ||
    !stock ||
    name === "" ||
    description === "" ||
    price === "" ||
    image === "" ||
    category === "" ||
    stock === ""
  ) {
    return next(errorHandler(400, "All fields are required to update!"));
  }

  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.recepieid,
      {
        name,
        description,
        price,
        image,
        stock,
        category,
      },
      { new: true } // This returns the updated document
    );

    if (!updatedMenu) {
      return next(errorHandler(404, "Menu item not found"));
    }

    res.status(200).json(updatedMenu);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteRecepie = async (req, res, next) => {
  try {
    await Menu.findByIdAndDelete(req.params.recepieid);
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

export const deleteAllRecepie = async (req, res, next) => {
  console.log("Delete All Menus called");
  const restaurantId = req.params.restaurantid;

  try {
    // Delete all menus where the restaurantid matches
    const result = await Menu.deleteMany({ restaurantid: restaurantId });

    if (result.deletedCount > 0) {
      res.status(200).json({
        message: `Successfully deleted ${result.deletedCount} menu(s) for restaurant ID ${restaurantId}`,
      });
    } else {
      res.status(404).json({
        message: `No menus found for restaurant ID ${restaurantId}`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting the menus",
      error: error.message,
    });
  }
};
