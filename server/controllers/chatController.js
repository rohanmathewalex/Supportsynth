const axios = require('axios');
const ChatHistory = require('../models/ChatHistory');
const memoryService = require('../services/memoryService');


exports.clearChatHistory = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find the user's chat history
        let chatHistory = await ChatHistory.findOne({ userId });

        if (!chatHistory) {
            return res.status(404).json({ error: 'Chat history not found' });
        }

        // Clear all sessions
        chatHistory.sessions = [];

        // Save the updated chat history
        await chatHistory.save();

        res.status(200).json({ message: 'Chat history cleared successfully' });
    } catch (error) {
        console.error('Error clearing chat history:', error);
        res.status(500).json({ error: 'Failed to clear chat history' });
    }
};

// Function to handle sending messages to the OpenAI API and receiving responses
exports.getChatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.userId;

        // Check if the user is asking about the previous question
        if (message.toLowerCase().includes('previously asked question')) {
            const lastUserMessage = await memoryService.getLastUserMessage(userId);
            if (lastUserMessage) {
                return res.status(200).json({ response: `The last question you asked was: "${lastUserMessage.content}"` });
            } else {
                return res.status(200).json({ response: "You haven't asked any questions in this session." });
            }
        }

        // Store the user's message
        await memoryService.storeMessage(userId, message, 'user');

        // Send the user's message to the OpenAI API
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
            max_tokens: 150,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            }
        });

        // Extract the bot's response
        const botMessage = response.data.choices[0].message.content.trim();

        // Store the bot's response
        await memoryService.storeMessage(userId, botMessage, 'bot');

        // Send the AI's response back to the frontend
        res.status(200).json({ response: botMessage });

    } catch (error) {
        console.error('Error communicating with OpenAI:', error.message);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
};


// Function to end the chat session and save it
exports.endChatSession = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find the user's chat history
        let chatHistory = await ChatHistory.findOne({ userId });

        if (!chatHistory) {
            return res.status(404).json({ error: 'Chat history not found' });
        }

        // Get the current session (the last one in the sessions array)
        const currentSession = chatHistory.sessions[chatHistory.sessions.length - 1];

        // Only save the session if there are messages in it
        if (currentSession.messages.length > 0) {
            // Save the updated chat history in the database
            await chatHistory.save();
        }

        // Respond to the frontend
        res.status(200).json({ message: 'Chat session ended and saved successfully' });

    } catch (error) {
        console.error('Error ending chat session:', error);
        res.status(500).json({ error: 'Failed to end chat session' });
    }
};

// Function to determine if a new session should be started
function shouldStartNewSession(chatHistory) {
    const lastSession = chatHistory.sessions[chatHistory.sessions.length - 1];
    const sessionAgeInMinutes = (Date.now() - new Date(lastSession.createdAt).getTime()) / (1000 * 60);
    return sessionAgeInMinutes > 30; // Start a new session if the last session is older than 30 minutes
}

