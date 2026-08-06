import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use("/api", chatRoutes);
app.use("/api/auth",authRoutes);
console.log(process.env.JWT_SECRET);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected with database");
  } catch (error) {
    console.log("Failed to connect with DB!", error);
  }
};

