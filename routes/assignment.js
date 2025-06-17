const express = require('express');
const router = express.Router();
const Nurse = require('../models/nurse');
const Patient = require('../models/patient');

// Show assignment form
router.get('/assign', async (req, res) => {
    try {
        const nurses = await Nurse.find();
        const patients = await Patient.find();

        res.render('assign', { nurses, patients, message: null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle nurse-patient assignment
router.post('/assign', async (req, res) => {
    const { nurseId, patientId } = req.body;

    try {
        const nurse = await Nurse.findById(nurseId);
        const patient = await Patient.findById(patientId);

        if (!nurse || !patient) {
            return res.status(404).send('Nurse or Patient not found');
        }

        // Assign patient to nurse
        nurse.patients.push(patient._id);
        await nurse.save();

        // Assign nurse to patient
        patient.nurse = nurse._id;
        await patient.save();

        const nurses = await Nurse.find();
        const patients = await Patient.find();

        res.render('assign', { nurses, patients, message: 'Nurse successfully assigned to patient!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
