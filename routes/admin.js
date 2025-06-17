const express = require('express');
const app = express.Router();
const Nurse = require('../models/nurse');
const Patient = require('../models/patient');

// Admin login page
app.get('/admin-login', (req, res) => {
    res.render('admin-login', { error: null });
});

// Admin login form submission
app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;

    console.log('Received username:', username);
    console.log('Received password:', password);

    // Example admin credentials
    if ((username === 'Shallen' && password === 'sequeira') || (username === 'admin' && password === 'admin123')) {
        return res.redirect('/admin-dashboard');
    } else {
        return res.render('admin-login', { error: 'Invalid Credentials' });
    }
});

// Admin dashboard
app.get('/admin-dashboard', async (req, res) => {
    try {
        console.log('Fetching nurse and patient counts...');

        const nurseCount = await Nurse.countDocuments();
        const patientCount = await Patient.countDocuments();
        const connectedPatientsCount = await Patient.countDocuments({ nurse: { $ne: null } });

        console.log('Nurse Count:', nurseCount);
        console.log('Patient Count:', patientCount);
        console.log('Connected Patients Count:', connectedPatientsCount);

        const message = req.query.message || null;

        res.render('admin-dashboard', { nurseCount, patientCount, connectedPatientsCount, message });
    } catch (error) {
        console.error('Error in admin-dashboard:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Display assign form
app.get('/assign', async (req, res) => {
    try {
        const nurses = await Nurse.find();
        const patients = await Patient.find();
        res.render('assign', { nurses, patients, message: null });
    } catch (error) {
        console.error('Error loading assign page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle assign form submission
app.post('/assign', async (req, res) => {
    const { nurseId, patientId } = req.body;

    try {
        // Connect patient to nurse
        await Nurse.findByIdAndUpdate(nurseId, { $addToSet: { patients: patientId } });
        await Patient.findByIdAndUpdate(patientId, { nurse: nurseId });

        console.log(`Assigned nurse ${nurseId} to patient ${patientId}`);
        res.redirect('/admin-dashboard?message=Nurse%20successfully%20assigned%20to%20patient!');
    } catch (error) {
        console.error('Error assigning nurse:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;





