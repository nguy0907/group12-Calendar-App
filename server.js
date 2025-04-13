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
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public dir
app.use(session({
    secret: 'schoolprojectsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 15 * 60 * 1000 // Session expires after 15 minutes (in milliseconds)
    }
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
            userID = user.UserID; // Assuming UserID is the primary key in Users table
            res.redirect('/dashboard'); // Redirect to a protected page
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});


// Logout Route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Failed to destroy session');
      }
      res.send('Logged out successfully');
    });
  });

// Protected Route
app.get('/dashboard', (req, res) => {
    CheckAuthentication(req.session.user);
    res.send(`Welcome ${req.session.user.UserName}, you are logged in! Your user ID is ${req.session.user.UserID}.`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// API Route to Get Calendar Tasks
app.get('/calendartasks', (req, res) => {

    const { authorID } = req.query; // Extract userId from query parameters
    
    let query = 'SELECT * FROM CalendarTasks';
    const queryParams = [];

    // If userId is provided, filter results
    if (authorID) {
        query += ' WHERE AuthorID = ?';
        queryParams.push(authorID);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching calendar tasks:', err.message);
            res.status(500).send('Error fetching calendar tasks');
        } else {
            res.json(results);
        }
    });
});

// API Route to Get Social Posts
app.get('/socialposts', (req, res) => {
    
    const { authorID } = req.query; // Extract userId from query parameters
    
    let query = 'SELECT * FROM SocialPosts';
    const queryParams = [];

    // If userId is provided, filter results
    if (authorID) {
        query += ' WHERE AuthorID = ?';
        queryParams.push(authorID);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching calendar tasks:', err.message);
            res.status(500).send('Error fetching calendar tasks');
        } else {
            res.json(results);
        }
    });
});

// post Route
app.post('/socialposts/post', (req, res) => {
    console.log(req.body);

    if(!CheckAuthentication(req.session.user)) {
        return res.status(401).send('Please login again.');
    }

    const query = 'INSERT INTO socialposts (AuthorID, PostTitle, PostContent, DateCreated) VALUES (?, ?, ?, ?)';
    const values = [req.session.user.UserID, req.body.posttitle, req.body.content, req.body.createdAt];

    db.query(query, values, async (err, result) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).send('Server error');
        }
        res.status(200).send('Data added successfully'); // Send a success response
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function CheckAuthentication(userSession) {
    if (!userSession) {
        return false;
    } else {
        return true
    }
}
