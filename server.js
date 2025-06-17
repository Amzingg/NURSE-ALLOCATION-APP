const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// ====================== Middleware ======================
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// ====================== Routes ======================
const nurseRoutes = require('./routes/nurse');
const patientRoutes = require('./routes/patient');
const adminRoutes = require('./routes/admin');
const assignmentRoutes = require('./routes/assignment'); // ✅ Assignment Route

app.use('/', nurseRoutes);
app.use('/', patientRoutes);
app.use('/', adminRoutes);
app.use('/', assignmentRoutes);

// ====================== MongoDB Connection ======================
mongoose.connect(process.env.MONGO_URI ?? 'mongodb://localhost:27017/smartcaredb')
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// ====================== Static Pages ======================

// Home Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// About Page
app.get('/about', (req, res) => {
    res.render('about');
});

// Contact Page
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Contact Form Submission Handler (optional)
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // For now, just print the form data to the console
    console.log('Contact Form Submission:', { name, email, message });

    // You can display a simple success message or redirect
    res.send(`<h1>Thank you for contacting us, ${name}!</h1><a href="/">Return to Home</a>`);
});

// Logout (Redirect to Home Page)
app.get('/logout', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 Page Handler
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

// ====================== Start Server ======================
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));



