import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, password, email } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    password === "" ||
    email === ""
  ) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  const hasedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hasedPassword,
  });

  try {
    await newUser.save();
    res.json({ message: "Sign Up SuccessFully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
