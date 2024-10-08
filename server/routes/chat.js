const express = require('express');
const { handleChatQuery, getChatbotResponse, endChatSession, clearChatHistory, getChatHistory } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is authenticated

const router = express.Router();

// Define the route for sending messages to the chatbot
router.post('/respond', authMiddleware, getChatbotResponse);
router.post('/end', authMiddleware, endChatSession);
router.delete('/clear', authMiddleware, clearChatHistory);
router.get('/history', authMiddleware, getChatHistory);
router.post('/query', handleChatQuery);

module.exports = router;


/**
 * Now, let's create a route that the frontend can use to send messages to the chatbot.
 * 
 * This route allows the frontend to send a POST request to /api/chat/respond to communicate with the chatbot.
 */