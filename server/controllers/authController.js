const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register function
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user with the hashed password
    const newUser = new User({ username, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message and the new user object
    res.status(201).json({ status: 'success', message: 'User registered successfully', newUser });

  } catch (error) {
    // Handle errors that may occur during the registration process
    res.status(500).json({ status: 'error', message: 'Error registering user' });
  }
};

// Login function
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // Generate a JWT token with the user's ID as payload
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token and the user object
    res.status(200).json({ status: 'success', token, user });

  } catch (error) {
    // Handle errors that may occur during the login process
    res.status(500).json({ status: 'error', message: 'Error logging in' });
  }
};
