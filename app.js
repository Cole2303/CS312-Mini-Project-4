const express = require('express');
const app = express();
const { Pool } = require('pg');
const session = require('express-session');
const cors = require('cors');

// Enable CORS to allow communication between frontend and backend
app.use(cors());

// Session configuration for storing login information
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware to handle form data and JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// PostgreSQL pool configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'BlogDB',
    password: 'Munchie4478!',
    port: 5432,
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user_id) {
        return next();
    }
    res.status(401).json({ error: "Unauthorized" });
}

// Route to fetch all blog posts and the user ID
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blogs ORDER BY date_created DESC');
        res.json({
            posts: result.rows,
            user_id: req.session.user_id || null // Send user_id if logged in, otherwise null
        });
    } catch (err) {
        console.error('Error fetching posts from database:', err.stack);
        res.status(500).send('Error fetching posts from database.');
    }
});

// Route to create a new post
app.post('/posts', isAuthenticated, async (req, res) => {
    const { title, message } = req.body;
    const user_id = req.session.user_id;

    if (!title || !message) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const user = await pool.query('SELECT name FROM users WHERE user_id = $1', [user_id]);
        await pool.query(
            'INSERT INTO blogs (title, body, creator_name, creator_user_id, date_created) VALUES ($1, $2, $3, $4, NOW())',
            [title, message, user.rows[0].name, user_id]
        );
        res.status(201).json({ message: "Post created successfully!" });
    } catch (err) {
        console.error('Error creating a new blog post:', err.stack);
        res.status(500).send('Error creating a new blog post.');
    }
});

// Route to handle user signup
app.post('/signup', async (req, res) => {
    const { user_id, name, password } = req.body;

    if (!user_id || !name || !password) {
        return res.status(400).json({ error: "All fields are required for signup!" });
    }

    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);

        if (userCheck.rows.length > 0) {
            res.status(409).json({ error: "User ID already taken. Please choose a different one." });
        } else {
            await pool.query(
                'INSERT INTO users (user_id, name, password) VALUES ($1, $2, $3)',
                [user_id, name, password]
            );
            res.status(201).json({ message: "User signed up successfully!" });
        }
    } catch (err) {
        console.error('Error during sign-up:', err.stack);
        res.status(500).send('Error during sign-up.');
    }
});

// Route to handle user sign-in
app.post('/signin', async (req, res) => {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
        return res.status(400).json({ error: "User ID and password are required to sign in!" });
    }

    try {
        const userCheck = await pool.query(
            'SELECT * FROM users WHERE user_id = $1 AND password = $2',
            [user_id, password]
        );

        if (userCheck.rows.length > 0) {
            req.session.user_id = user_id;
            res.status(200).json({ message: "User signed in successfully!" });
        } else {
            res.status(401).json({ error: "Incorrect user ID or password." });
        }
    } catch (err) {
        console.error('Error during sign-in:', err.stack);
        res.status(500).send('Error during sign-in.');
    }
});

// Route to handle user logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: "User logged out successfully!" });
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
