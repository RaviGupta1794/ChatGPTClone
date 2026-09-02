import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// ==========================
// DATABASE CONNECTION
// ==========================

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connected with database");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// ==========================
// CONNECT DATABASE
// ==========================

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// ==========================
// ROUTES
// ==========================

app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

// ==========================
// TEST
// ==========================

app.get("/", (req, res) => {
  res.json({
    message: "MyOwnGPT Backend is running",
  });
});

export default app;