// models/nurse.js
const mongoose = require('mongoose');

const nurseSchema = new mongoose.Schema({
    name: String,
    contact: String,
    email: String,
    adhaar: String,
    unique: String,
    gender: String,
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }]
});

module.exports = mongoose.model('Nurse', nurseSchema);
