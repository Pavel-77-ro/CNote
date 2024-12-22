const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const loginLimiter = require('../middleware/rateLimiter');
const { registerSchema, loginSchema } = require('../utils/validation');


// Register a new user
router.post('/register', async (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password } = req.body;

    try {
        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            const error = new Error('Username already exists');
            error.status = 400; // Bad Request
            return next(error);
        }

        // Create and save the new user
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        next(err); // Forward unexpected errors to the error handler
    }
});

// Log in a user
router.post('/login',loginLimiter, async (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            const error = new Error('Invalid credentials');
            error.status = 401;
            return next(error);
        }

        // Generate Access Token
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

        // Generate Refresh Token
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Store the refresh token securely (e.g., HttpOnly cookie)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'strict', // Protect against CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({ accessToken, message: 'Login successful' });
    } catch (err) {
        next(err);
    }
});

router.post('/refresh', async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken; // Get the token from the cookie

    if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token provided' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Generate a new access token
        const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '10m' });

        res.status(200).json({ accessToken });
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
});


module.exports = router;
