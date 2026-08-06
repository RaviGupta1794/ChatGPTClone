import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/gemini.js";

// create chat
export const createChat = async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" });
  }

  try {
    let thread = await Thread.findOne({
      threadId,
      userId: req.user.id,
    });

    if (!thread) {
      thread = new Thread({
        userId: req.user.id,
        threadId,
        title: message,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });
    } else {
      thread.messages.push({
        role: "user",
        content: message,
      });
    }

    const assistantReply = await getGeminiResponse(message);

    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();

    await thread.save();

    res.status(200).json({
      reply: assistantReply,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong!",
    });
  }
};


// get all threads
export const getAllThreads = async (req, res) => {
  try {
    const threads = await Thread.find({
      userId: req.user.id,
    }).sort({
      updatedAt: -1,
    });

    res.status(200).json(threads);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch threads",
    });
  }
};


// get thread by id
export const getThreadById = async (req, res) => {
  try {
    const { threadId } = req.params;

    const thread = await Thread.findOne({
      threadId,
      userId: req.user.id,
    });

    if (!thread) {
      return res.status(404).json({
        error: "Thread not found",
      });
    }

    res.status(200).json(thread.messages);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch thread",
    });
  }
};


// delete thread
export const deleteThread = async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId,
      userId: req.user.id,
    });

    if (!deletedThread) {
      return res.status(404).json({
        error: "Thread not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Thread deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete thread",
    });
  }
};