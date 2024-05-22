// Import necessary modules and libraries

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const path = require('path');
const tutorialsRouter = require('./routes/router');

const app = express();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const hardcodedUsername = 'admin';
const hardcodedPassword = 'dnuorgyalplexip';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', tutorialsRouter);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/content', (req, res) => {
    res.render('content');
});

// Login route
app.get('/login', (req, res) => {
    res.render('login');
});

// Login route - POST
app.post('/login', (req, res) => {
    // Login logic is handled here
    const { username, password } = req.body;

    // Check if the username and password are valid
    if (username === hardcodedUsername && password === hardcodedPassword) {
        // Set a session variable to indicate that the user is authenticated
        req.session.isAuthenticated = true;
        res.redirect('/admin');
    } else {
        res.redirect('/login');
    }
});