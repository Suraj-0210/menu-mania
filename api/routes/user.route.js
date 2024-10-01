import express from "express";
import { test } from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { updateUser, deleteUser } from "../controller/user.controller.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userid", verifyToken, updateUser);
router.delete("/delete/:userid", verifyToken, deleteUser);

export default router;
