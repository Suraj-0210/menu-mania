import express from "express";
import {
  deleteUser,
  signout,
  test,
  updateUser,
} from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userid", verifyToken, updateUser);
router.delete("/delete/:userid", verifyToken, deleteUser);
router.post("/signout", signout);

export default router;
