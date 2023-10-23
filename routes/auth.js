const express = require('express');
const dotenv = require('dotenv');

const jwt = require('jsonwebtoken');

const router = express.Router();
dotenv.config();

router.post('/', (req, res) => {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ username: process.env.ADMIN_USERNAME }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
        res.json({ accessToken: token });
    } else {
        res.status(401).json({ message: 'Invalid credentials.' });
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = { router, authenticateToken };

