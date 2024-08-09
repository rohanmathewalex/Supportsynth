const axios = require('axios');

exports.getChatbotResponse = async (req, res) => {
    try {
        const { message } = req.body; // Extract the user's message from the request body

        // Send a POST request to the OpenAI API with the user's message
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

        // Send the AI's response back to the frontend
        res.status(200).json({ response: response.data.choices[0].message.content.trim() });

    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
};
