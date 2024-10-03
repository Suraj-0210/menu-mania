import express from "express";
import { test } from "../controller/user.controller.js";
import {
  createRestaurant,
  deleteRestaurant,
  fetchRestaurants,
} from "../controller/restaurant.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/test", test);
router.post("/createRestaurant", createRestaurant);
router.delete("/delete/:restaurantid", verifyToken, deleteRestaurant);
router.get("/:user_id", fetchRestaurants);

export default router;
