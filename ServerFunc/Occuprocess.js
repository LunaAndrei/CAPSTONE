const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors package
const pool = require('./db');
const app = express();
const port = 8000;

// Use cors middleware
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to handle form submission
app.post('/submitForm', upload.fields([
    { name: 'coe', maxCount: 1 },
    { name: 'healthCard', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'officialReceipt', maxCount: 1 }
]), async (req, res) => {
    const {
        lastName, firstName, middleName, suffix, homeAddress, dob, age, placeOfBirth,
        cellphoneNumber, email, gender, civilStatus, companyName, jobPosition,Typeofid,
        philSysId, orNumber, orExtension, orDate, orAmount,ctcNumber,ctcDateIssued,ctcPlaceIssued
    } = req.body;

    // Get file paths from multer
    const coe = req.files['coe'] ? req.files['coe'][0].path : null;
    const healthCard = req.files['healthCard'] ? req.files['healthCard'][0].path : null;
    const birthCertificate = req.files['birthCertificate'] ? req.files['birthCertificate'][0].path : null;
    const officialReceipt = req.files['officialReceipt'] ? req.files['officialReceipt'][0].path : null;

    try {
        const query = `
            INSERT INTO public."OccuPermit" (
                "Occuid", "Lastname", "Firstname", "Middlename", "Suffix", "Address", "DateofBirth", "Age", "PlaceofBirth",
                "ContactNo", "Email", "Gender", "CivilStatus", "CompanyName", "JobPosition", "Typeofid",
                "PhilSysId", "COE", "HealthCard", "BirthCertificate", "OfficialReceipt",
                "ORNumber", "ORExtension", "ORDate", "ORAmount","CTCNumber", "CTCDateIssued", "CTCPlaceIssued"
            ) VALUES (
                DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
                $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23,$24,$25,$26,$27
            )
        `;
        const ctcDateIssued = new Date(req.body.ctcDateIssued).toISOString().split('T')[0];
        const values = [
            lastName, firstName, middleName, suffix, homeAddress, dob, age, placeOfBirth,
            cellphoneNumber, email, gender, civilStatus, companyName, jobPosition,
            philSysId, coe, healthCard, birthCertificate, officialReceipt,Typeofid,
            orNumber, orExtension, orDate, orAmount,ctcNumber,ctcDateIssued,ctcPlaceIssued
        ];

        await pool.query(query, values);
        res.send('Form submitted successfully!');
    } catch (err) {
        console.error('Error inserting data', err);
        res.status(500).send('Error submitting form');
    }
});

// Serve static files from 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
