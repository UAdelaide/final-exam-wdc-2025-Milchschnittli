const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
// Session Middleware requirement
const session = require('express-session');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Session Middleware
app.use(session({
    secret: 'myDogSecret123',
    resave: false,
    saveUninitialized: true
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Login Routes
const pool = require('./db');

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query(
            'SELECT * FROM Users WHERE username = ? AND password_hash = ?',
            [username, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Used to store the session
        req.session.user = {
            id: rows[0].user_id,
            username: rows[0].username,
            role: rows[0].role
        };

        // Sends the user to their respective dashboard for whether owner or walker
        if (rows[0].role === 'owner') {
            return res.json({ redirect: '/owner-dashboard.html' });
        }
            return res.json({ redirect: '/walker-dashboard.html' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed ' });
    }
});

// Logout Route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
    if (err) {
        return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out', redirect: '/' });
    });
});

// Backend route to return session user's dogs
app.get('/api/owner/dogs', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'owner') {
    return res.status(401).json({ error: 'Unauthorized '});
    }

    try {
        const [rows] = await
    }
})


// Export the app instead of listening here
module.exports = app;
