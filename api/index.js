import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import restaurantRoutes from "./routes/restaurant.route.js";
import cookieParser from "cookie-parser";
import menuRoutes from "./routes/menu.route.js";
import path from "path";
import cors from "cors";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Mongo DB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

// Configure CORS options
const corsOptions = {
  origin: "https://menumania.vercel.app", // Allow only this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  credentials: true, // Allow credentials (if needed)
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

app.use("/api/user", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/restaurant", restaurantRoutes);

app.use("/api/menu", menuRoutes);

app.get("/", (req, res) => {
  res.send("Your are Ready to GO!!");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "dist", "index.html"));
});

app.use(express.static(path.join(__dirname, "/blog-frontend/dist")));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.json({
    success: false,
    statusCode,
    message,
  });
});
