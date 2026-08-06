import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const port = 8080;
app.use(cors());
app.use(express.json());
app.use("/api", chatRoutes);
app.use("/api/auth",authRoutes);
console.log(process.env.JWT_SECRET);
// app.post("/chat", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [
//             {
//               text: req.body.prompt,
//             },
//           ],
//         },
//       ],
//     }),
//   };

//   try {
//     const { prompt } = req.body;
//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       options,
//     );
//     const data = await response.json();

//     if (!response.ok) {
//       return res.status(response.status).json(data);
//     }

//     const answer =
//       data.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "No response generated.";

//     // res.json({
//     //     success: true,
//     //     reply: answer
//     // });
//     res.send(answer);
//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// });
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
// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
// });

// const response = await ai.models.generateContent({
//     model: "gemini-3.6-flash",
//     contents: "give me a joke",
// });

// console.log(response.text);
