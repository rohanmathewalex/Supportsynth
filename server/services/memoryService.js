const ChatHistory = require('../models/ChatHistory');

// Function to store a new chat message in the user's chat history
exports.storeMessage = async (userId, message, sender) => {
    try {
        let chatHistory = await ChatHistory.findOne({ userId });

        if (!chatHistory) {
            chatHistory = new ChatHistory({ userId, sessions: [] });
        }

        if (chatHistory.sessions.length === 0 || shouldStartNewSession(chatHistory)) {
            chatHistory.sessions.push({ messages: [] });
        }

        const currentSession = chatHistory.sessions[chatHistory.sessions.length - 1];
        currentSession.messages.push({ sender, content: message });

        await chatHistory.save();
    } catch (error) {
        console.error('Error storing message:', error);
        throw new Error('Failed to store chat message');
    }
};

// Function to get the last user message
exports.getLastUserMessage = async (userId) => {
    try {
        const chatHistory = await ChatHistory.findOne({ userId });
        if (!chatHistory || chatHistory.sessions.length === 0) return null;

        const currentSession = chatHistory.sessions[chatHistory.sessions.length - 1];
        const lastUserMessage = currentSession.messages.reverse().find(msg => msg.sender === 'user');

        return lastUserMessage || null;
    } catch (error) {
        console.error('Error retrieving last user message:', error);
        throw new Error('Failed to retrieve last user message');
    }
};

// Function to check if a new session should start
const shouldStartNewSession = (chatHistory) => {
    const lastSession = chatHistory.sessions[chatHistory.sessions.length - 1];
    const sessionAgeInMinutes = (Date.now() - new Date(lastSession.createdAt).getTime()) / (1000 * 60);
    return sessionAgeInMinutes > 30;
};
