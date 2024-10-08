const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors package
const pool = require('./db');
const router = express.Router();
const port = 8000;

// Use cors middleware
router.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Endpoint to handle form submission
router.post('/submitForm', upload.fields([
    { name: 'coe', maxCount: 1 },
    { name: 'healthCard', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'officialReceipt', maxCount: 1 }
]), async (req, res) => {
    const {
        lastName, firstName, middleName, suffix, homeAddress, dob, age, placeOfBirth,
        cellphoneNumber, email, gender, civilStatus, companyName, jobPosition, combinedId,
        orNumber, orExtension, orDate, orAmount, ctcNumber, ctcDateIssued, ctcPlaceIssued
    } = req.body;

    // Get file paths from multer
    const coe = req.files['coe'] ? req.files['coe'][0].path : null;
    const healthCard = req.files['healthCard'] ? req.files['healthCard'][0].path : null;
    const birthCertificate = req.files['birthCertificate'] ? req.files['birthCertificate'][0].path : null;
    const officialReceipt = req.files['officialReceipt'] ? req.files['officialReceipt'][0].path : null;

    try {
        const query = `
            INSERT INTO public."OccuPermit" (
                "Lastname", "Firstname", "Middlename", "Suffix", "Address", "DateofBirth", "Age", "PlaceofBirth",
                "ContactNo", "Email", "Gender", "CivilStatus", "CompanyName", "JobPosition", "combinedId",
                "COE", "HealthCard", "BirthCertificate", "OfficialReceipt",
                "ORNumber", "ORExtension", "ORDate", "ORAmount", "CTCNumber", "CTCDateIssued", "CTCPlaceIssued"
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
                $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
            )
        `;
        
        const formattedCtcDateIssued = new Date(ctcDateIssued).toISOString().split('T')[0];

        const values = [
            lastName, firstName, middleName, suffix, homeAddress, dob, age, placeOfBirth,
            cellphoneNumber, email, gender, civilStatus, companyName, jobPosition, combinedId,
            coe, healthCard, birthCertificate, officialReceipt,
            orNumber, orExtension, orDate, orAmount, ctcNumber, formattedCtcDateIssued, ctcPlaceIssued
        ];

        await pool.query(query, values);
        res.send('Form submitted successfully!');
    } catch (err) {
        console.error('Error inserting data', err);
        res.status(500).send('Error submitting form');
    }
});


// Serve static files from 'uploads' directory
router.use('/uploads', express.static('uploads'));

// Start the server
module.exports = router;
