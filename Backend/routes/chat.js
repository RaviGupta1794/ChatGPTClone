import express from "express";
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/gemini.js";
import {
  createChat,
  getAllThreads,
  getThreadById,
  deleteThread,
} from "../controller/chatController.js";
import fetchUser from "../middlewares/fetchUser.js";
const router = express.Router();

//test
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "abs",
      title: "testing new gemini",
    });
    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.send(500).json({ err: "Failed to save" });
  }
});

//get all threads

router.get("/thread", fetchUser, getAllThreads);

// get thread by id
router.get("/thread/:threadId", fetchUser, getThreadById);

//delete
router.delete("/thread/:threadId", fetchUser, deleteThread);

//create chat
router.post("/chat", fetchUser, createChat);

export default router;
