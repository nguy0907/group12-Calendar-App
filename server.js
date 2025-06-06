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

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

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

// Route to retrieve session data (for frontend)
app.get('/session', (req, res) => {
    if (req.session && req.session.user) {
        const userInfo = {
            UserName: req.session.user.UserName, // Include only the user's name
            userID: req.session.user.UserID,     // Include the user's ID
            email: req.session.user.Email,                    // Add additional custom fields
          };
      
          res.json(userInfo);
    } else {
      res.status(401).json({ message: 'No active session' });
    }
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
    if(!CheckAuthentication(req.session.user)) {
        return res.status(401).send('Please login again.');
    }
    // res.send(`Welcome ${req.session.user.UserName}, you are logged in! Your user ID is ${req.session.user.UserID}.`);
    res.status(200).sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.get('/', (req, res) => {

    if(!CheckAuthentication(req.session.user)) {
        res.redirect('/login');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'main.html'));
    }
});

// API Route to Get Calendar Tasks
app.get('/calendartasks', (req, res) => {

    if(!CheckAuthentication(req.session.user)) {
        return res.status(401).send('Please login again.');
    }
    
    
    let query = 'SELECT * FROM CalendarTasks WHERE AuthorID = ?';
    const authorID = req.session.user.UserID; // Get AuthorID from session
    const { date } = req.query; // Extract userId from query parameters
    const { taskid } = req.query; // Extract taskID from query parameters


    const queryParams = [authorID];

    // If date is provided, filter results
    if (date) {
        query += ' AND DATE(date) = ?';
        queryParams.push(date);
    }

    // If id is provided, filter results
    if (taskid) {
        query += ' AND CTID = ?';
        queryParams.push(taskid);
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
    
    let query = `
        SELECT sp.SPID, sp.PostTitle, sp.PostContent, sp.DateCreated, sp.AuthorID, u.UserName 
        FROM SocialPosts sp 
        JOIN Users u ON sp.AuthorID = u.userID
    `;
    const queryParams = [];

    // If userId is provided, filter results
    if (authorID) {
        query += ' WHERE AuthorID = ?';
        queryParams.push(authorID);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching social posts:', err.message);
            res.status(500).send('Error fetching social posts');
        } else {
            res.json(results);
        }
    });
});

// Create Social Post Route
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

// Create Social Post Serving Route
app.get('/socialposts/post', (req, res) => {
    // Check if the user is authenticated
    if(!CheckAuthentication(req.session.user)) {
        return res.status(401).send('Please login again.');
    }
    res.sendFile(path.join(__dirname, 'public', 'newsocialpost.html'));
});

// Create Calendar Task Route
app.post('/calendartasks/createtask', (req, res) => {
    console.log(req.body);

    // Check if the user is authenticated
    if(!CheckAuthentication(req.session.user)) {
        return res.status(401).send('Please login again.');
    }

    const query = 'INSERT INTO calendartasks (AuthorID, Title, Description, Date) VALUES (?, ?, ?, ?)';
    const values = [req.session.user.UserID, req.body.title, req.body.description, req.body.date];

    db.query(query, values, async (err, result) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).send('Server error');
        }
        res.status(200).send('Calendar Task added successfully'); // Send a success response
    });
});

// Create Calendar Task Serving Route
app.get('/calendartasks/createtask', (req, res) => {
    // Check if the user is authenticated
    if(!CheckAuthentication(req.session.user)) {
        return res.status(401).send('Please login again.');
    }
    res.sendFile(path.join(__dirname, 'public', 'newcalendartask.html'));
});

// Update Calendar Task Route
// This route updates a task in the calendar tasks table
app.put('/calendartasks/edittask/:id', (req, res) => {
    console.log(req.body);

    // Check if the user is authenticated
    if (!CheckAuthentication(req.session.user)) {
        return res.status(401).send('Please login again.');
    }

    const query = `UPDATE calendartasks SET Title = ?, Description = ?, Date = ? WHERE CTID = ? AND AuthorID = ?`;
    
    const values = [
        req.body.title, 
        req.body.description, 
        req.body.date, 
        req.params.id,       // TaskID from the URL parameter
        req.session.user.UserID // AuthorID from the session
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).send('Server error');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Task not found or unauthorized'); // Handle no matching task
        }

        res.status(200).send('Calendar Task updated successfully'); // Send a success response
    });
});

// Edit Calendar Task Serving Route
app.get('/calendartasks/edittask', (req, res) => {
    // Check if the user is authenticated
    if(!CheckAuthentication(req.session.user)) {
        return res.status(401).send('Please login again.');
    }
    res.sendFile(path.join(__dirname, 'public', 'editcalendartask.html'));
});

// Delete Calendar Task Route
// This route updates a task in the calendar tasks table
app.delete('/calendartasks/removetask/:id', (req, res) => {
    // Check if the user is authenticated
    if (!CheckAuthentication(req.session.user)) {
        return res.status(401).send('Please login again.');
    }

    const query = `DELETE FROM calendartasks WHERE CTID = ? AND AuthorID = ?`;
    
    const values = [
        req.params.id,       // TaskID from the URL parameter
        req.session.user.UserID // AuthorID from the session
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).send('Server error');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Task not found or unauthorized'); // Handle no matching task
        }

        res.status(200).send('Calendar Task updated successfully'); // Send a success response
    });
});

// Create New User
app.post('/users/newuser', (req, res) => {
    console.log(req.body);

    const query = 'INSERT INTO users (UserName, Email, Password) VALUES (?, ?, ?)';
    const values = [req.body.username, req.body.email, req.body.password];

    db.query(query, values, async (err, result) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).send('Server error');
        }
        res.status(200).send('Data added successfully'); // Send a success response
    });
});

// New User Serving Route
app.get('/users/newuser', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'createnewuser.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function CheckAuthentication(userSession) {
    return !! userSession; // Return true if userSession exists, false otherwise
}
