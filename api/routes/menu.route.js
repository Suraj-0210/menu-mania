import express from "express";
import { test } from "../controller/menu.controller.js";
import {
  createRecepie,
  deleteRecepie,
  fetchRecepie,
} from "../controller/menu.controller.js";

const router = express.Router();

router.get("/test", test);
router.post("/createRecepie", createRecepie);
router.delete("/delete/:recepiename", deleteRecepie);
router.get("/:restaurantid", fetchRecepie);

export default router;
