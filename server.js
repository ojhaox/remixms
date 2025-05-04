const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:8000', 'http://localhost', 'http://51.79.248.100'],
    methods: ['GET', 'POST'],
    credentials: true
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

// Database configuration for game server's MySQL
const dbConfig = {
    host: '51.79.248.100',     // Your VPS IP
    user: 'root',               // Username
    password: 'root',           // Password
    database: 'v83',            // Default schema
    port: 3306                  // Port
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Get a connection from the pool
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
    
    // Test the connection with a simple query
    connection.query('SELECT DATABASE()', (err, results) => {
        if (err) {
            console.error('Error testing database connection:', err);
        } else {
            console.log('Current database:', results[0]['DATABASE()']);
        }
        connection.release();
    });
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    console.log('Received registration request:', { username, email });

    // Basic validation
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (username.length > 13) {
        return res.status(400).json({ error: 'Username must be 13 characters or less' });
    }

    try {
        console.log('Attempting to register user:', username);
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');

        // Get a new connection from the pool
        const connection = await pool.promise().getConnection();
        console.log('Got database connection');

        try {
            // Check if username already exists
            const [existingUsers] = await connection.query(
                'SELECT * FROM accounts WHERE name = ?',
                [username]
            );
            console.log('Username check complete, found:', existingUsers.length, 'existing users');

            if (existingUsers.length > 0) {
                console.log('Username already exists');
                return res.status(400).json({ error: 'Username already exists' });
            }

            // Insert new account
            console.log('Attempting to insert new account');
            const [result] = await connection.query(
                'INSERT INTO accounts (name, password, email, gm, banned) VALUES (?, ?, ?, 0, 0)',
                [username, hashedPassword, email]
            );
            console.log('Insert result:', result);
            console.log('Account created successfully');

            res.status(201).json({ message: 'Account created successfully' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Detailed error during registration:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to create account', details: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 