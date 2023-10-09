const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const ADMIN_USERNAME = 'adminCazalet';
const ADMIN_PASSWORD = 'ToutCurageArudy*$';
const ACCESS_TOKEN_SECRET = 'your_access_token_secret'; // Change this to a more secure secret in production

router.post('/', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ username: ADMIN_USERNAME }, ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
        res.json({ accessToken: token });
    } else {
        res.status(401).json({ message: 'Invalid credentials.' });
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = { router, authenticateToken };

