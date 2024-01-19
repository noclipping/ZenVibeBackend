const express = require('express');
const passport = require('passport');
const router = express.Router();
const axios = require('axios');
const { Pool } = require('pg');

// PostgreSQL database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Route to handle chatbot interaction
router.post('/chatbot', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Check if the user is authenticated
    if (!req.user || !req.user.user_id) {
        return res.status(401).send('Unauthorized');
    }

    try {
        // Extract the user's message from the request body
        const userMessage = req.body.message;

        // Send a request to OpenAI's ChatGPT model with role set to "assistant"
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: "assistant", content: userMessage }] // Set role to "assistant"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Include the API key in the request header
            }
        });

        // Extract the response data
        const data = response.data;

        // Check if a valid AI response was received and respond back
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            const replyMessage = data.choices[0].message.content; // Extract the message content
            res.json({ reply: replyMessage.trim() }); // Send the AI's reply back to the client

            // Store the conversation history in the database
            const timestamp = new Date();
            await pool.query('INSERT INTO conversation_history (user_id, timestamp, role, message_content) VALUES ($1, $2, $3, $4)', [req.user.user_id, timestamp, 'user', userMessage]);
            await pool.query('INSERT INTO conversation_history (user_id, timestamp, role, message_content) VALUES ($1, $2, $3, $4)', [req.user.user_id, timestamp, 'assistant', replyMessage]);
        } else {
            res.status(500).send('Error processing AI response'); // Handle case where AI response is not as expected
        }
    } catch (error) {
        console.error('ChatGPT API Error:', error);
        res.status(500).send('Error processing your request'); // Handle any errors in the try block
    }
});


module.exports = router;
