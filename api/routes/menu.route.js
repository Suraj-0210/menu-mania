import express from "express";
import { test } from "../controller/menu.controller.js";
import {
  createRecepie,
  deleteRecepie,
  fetchRecepie,
  deleteAllRecepie,
  updateRecepie,
} from "../controller/menu.controller.js";

const router = express.Router();

router.get("/test", test);
router.post("/createRecepie", createRecepie);
router.put("/update/:recepieid", updateRecepie); // New update route
router.delete("/delete/:recepieid", deleteRecepie);
router.get("/:restaurantid", fetchRecepie);
router.delete("/deleteAll/:restaurantid", deleteAllRecepie);

export default router;
