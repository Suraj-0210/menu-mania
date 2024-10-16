import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Get token part

  console.log(token);

  if (!token) {
    console.log("no token while verifyUser");
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err.message);
      return next(errorHandler(401, "Unauthorized"));
    }
    console.log("no error while verifyUser");
    req.user = user;
    next();
  });
};
