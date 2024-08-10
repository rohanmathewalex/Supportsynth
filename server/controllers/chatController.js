const axios = require('axios');
const ChatHistory = require('../models/ChatHistory');

 

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
        const { message } = req.body; // Extract the user's message from the request body
        const userId = req.user.userId; // Get the user ID from the authenticated user

        // Retrieve existing chat history for the user
        let chatHistory = await ChatHistory.findOne({ userId });

        // If no chat history exists, create a new one
        if (!chatHistory) {
            chatHistory = new ChatHistory({ userId, sessions: [] });
        }

        // Determine if a new session is needed
        if (chatHistory.sessions.length === 0 || shouldStartNewSession(chatHistory)) {
            chatHistory.sessions.push({ messages: [] }); // Add a new session
        }

        // Get the current session (the last one in the sessions array)
        const currentSession = chatHistory.sessions[chatHistory.sessions.length - 1];

        // Add the user's message to the current session
        currentSession.messages.push({ sender: 'user', content: message });

        // Send the user's message to the OpenAI API
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo', // Specify the correct model
            messages: [{ role: 'user', content: message }],
            max_tokens: 150,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Use your OpenAI API key
            }
        });

        // Extract the bot's response from the API's response
        const botMessage = response.data.choices[0].message.content.trim();

        // Add the bot's response to the current session
        currentSession.messages.push({ sender: 'bot', content: botMessage });

        // Save the updated chat history in the database
        await chatHistory.save();

        // Send the AI's response back to the frontend
        res.status(200).json({ response: botMessage });

    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
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
