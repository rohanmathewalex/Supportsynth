const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chat');
const uploadRoutes = require('./routes/uploadRoutes');
const cors = require('cors');
const session = require('express-session');



const app = express();

// Add session middleware before your routes
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Secure should be true in production when using HTTPS
}));

// Apply CORS middleware to accept requests from your frontend domain
app.use(cors({
    origin: 'http://localhost:5173',  // Ensure this matches your frontend URL
    credentials: true
}));

app.use(express.json()); // Middleware to parse JSON

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);  // Normal chat routes
app.use('/api/upload', uploadRoutes);  // Document upload and query routes

// Generic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
