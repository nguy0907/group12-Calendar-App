const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');

const app = express();
const PORT = 3000;

// MySQL Connection Configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'primary',
    password: '12345',
    database: 'CalendarApp'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL!');
    }
});

// Middleware
app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For URL-encoded payloads
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'schoolprojectsecret',
    resave: false,
    saveUninitialized: true
}));

// Login Route
app.post('/login', (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    const query = 'SELECT * FROM Users WHERE UserName = ?';

    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).send('Server error');
        }
        
        if (results.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const user = results[0];
        const isPasswordValid = (password === user.Password);

        if (isPasswordValid) {
            req.session.user = user; // Save user data in session
            res.redirect('/dashboard'); // Redirect to a protected page
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});

// Protected Route
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Please login to access this page');
    }

    res.send(`Welcome ${req.session.user.UserName}, you are logged in!`);
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// API Route to Get Calendar Tasks
app.get('/api/calendartasks', (req, res) => {
    const query = 'SELECT * FROM CalendarTasks';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching calendar tasks:', err.message);
            res.status(500).send('Error fetching calendar tasks');
        } else {
            res.json(results);
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
