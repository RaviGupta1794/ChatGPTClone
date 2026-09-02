import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();

// ==========================
// MIDDLEWARE
// ==========================

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// ==========================
// DATABASE
// ==========================

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connected with database");
  } catch (error) {
    console.log("Failed to connect with DB!", error);
  }
};

// ==========================
// ROUTES
// ==========================

app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

// ==========================
// TEST ROUTE
// ==========================

app.get("/", async (req, res) => {
  await connectDB();

  res.json({
    message: "MyOwnGPT Backend is running",
  });
});

// ==========================
// VERCEL
// ==========================

export default app;