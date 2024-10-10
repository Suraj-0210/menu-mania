import express from "express";
import { test } from "../controller/user.controller.js";
import {
  createRestaurant,
  deleteRestaurant,
  fetchRestaurants,
  updateRestaurant,
  getRestaurant,
} from "../controller/restaurant.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/test", test);
router.get("/:restaurantid", getRestaurant);
router.post("/createRestaurant", createRestaurant);
router.delete("/delete/:restaurantid", verifyToken, deleteRestaurant);
router.get("/all/:user_id", fetchRestaurants);
router.put("/update/:restaurantid", verifyToken, updateRestaurant);

export default router;
