import express from "express";
import { extractUserId } from "../Middleware/auth.js";

const router = express.Router();

let conversations = [];
let messages = [];

// Get conversations with pagination and last message preview
router.get("/conversations", extractUserId, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const userConversations = conversations.filter((conv) =>
    conv.participants.includes(req.user.id)
  );

  const enhancedConvs = userConversations.map((conv) => ({
    ...conv,
    lastMessage: messages
      .filter((msg) => msg.conversationId === conv.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0],
  }));

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedConvs = enhancedConvs.slice(startIndex, endIndex);

  res.json({
    data: paginatedConvs,
    meta: {
      total: userConversations.length,
      page,
      totalPages: Math.ceil(userConversations.length / limit),
    },
  });
});

// Get messages with pagination and validation
router.get("/conversations/:id/messages", extractUserId, (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  const conversation = conversations.find(
    (conv) => conv.id === id && conv.participants.includes(req.user.id)
  );

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  const convMessages = messages
    .filter((msg) => msg.conversationId === id)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedMessages = convMessages.slice(startIndex, endIndex);

  res.json({
    data: paginatedMessages,
    meta: {
      total: convMessages.length,
      page,
      totalPages: Math.ceil(convMessages.length / limit),
    },
  });
});

// Message validation middleware
const validateMessage = (req, res, next) => {
  const { text } = req.body;
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "Message text is required" });
  }
  next();
};

// Send message with validation
router.post(
  "/conversations/:id/messages",
  extractUserId,
  validateMessage,
  (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    // Verify conversation exists and user is participant
    const conversation = conversations.find(
      (conv) => conv.id === id && conv.participants.includes(req.user.id)
    );

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId: id,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      senderId: req.user.id,
      senderName: req.user.name,
      isOwn: true,
    };

    messages.push(newMessage);

    // In real implementation: Save to database and emit real-time event
    res.status(201).json(newMessage);
  }
);

// Create new conversation
router.post("/conversations", extractUserId, (req, res) => {
  const { participants } = req.body;

  if (!Array.isArray(participants) || participants.length < 1) {
    return res.status(400).json({
      error: "Invalid participants list",
    });
  }

  // Add current user and remove duplicates
  const participantsSet = new Set([req.user.id, ...participants]);
  console.log("Participants Set:", participantsSet);
  const allParticipants = Array.from(participantsSet);
  console.log("All Participants:", allParticipants);

  if (allParticipants.length < 2) {
    return res.status(400).json({
      error:
        "A conversation must have at least two participants (including the creator).",
    });
  }

  // Check for existing conversation with exact same participants
  const existingConversation = conversations.find((conv) => {
    const convParticipantsSet = new Set(conv.participants);
    return (
      allParticipants.length === convParticipantsSet.size &&
      allParticipants.every((p) => convParticipantsSet.has(p))
    );
  });

  if (existingConversation) {
    return res.status(409).json({
      error: "A conversation  participant(s) already exists.",
      conversation: existingConversation,
    });
  }

  const newConversation = {
    id: `conv-${Date.now()}`,
    participants: allParticipants,
    createdAt: new Date().toISOString(),
    isGroup: participants.length > 1,
  };
  conversations.push(newConversation);

  res.status(201).json(newConversation);
});

export default router;
