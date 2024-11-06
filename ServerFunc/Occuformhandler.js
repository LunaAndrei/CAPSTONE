const express = require("express");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./db"); // PostgreSQL pool setup in db.js

const router = express.Router();

// Use cors middleware to allow cross-origin requests
router.use(cors());

// Set up multer storage in memory for binary file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Endpoint to handle form submission with binary file storage
router.post(
  "/submitForm",
  upload.fields([
    { name: "coe", maxCount: 1 },
    { name: "healthCard", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
    { name: "officialReceipt", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      lastName,
      firstName,
      middleName,
      suffix,
      homeAddress,
      dob,
      age,
      placeOfBirth,
      cellphoneNumber,
      email,
      gender,
      civilStatus,
      companyName,
      jobPosition,
      combinedId,
      orNumber,
      orExtension,
      orDate,
      orAmount,
      ctcNumber,
      ctcDateIssued,
      ctcPlaceIssued,
    } = req.body;

    // Get binary data from multer for each file
    const coe = req.files["coe"] ? req.files["coe"][0].buffer : null;
    const healthCard = req.files["healthCard"] ? req.files["healthCard"][0].buffer : null;
    const birthCertificate = req.files["birthCertificate"] ? req.files["birthCertificate"][0].buffer : null;
    const officialReceipt = req.files["officialReceipt"] ? req.files["officialReceipt"][0].buffer : null;

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

      const values = [
        lastName,
        firstName,
        middleName,
        suffix,
        homeAddress,
        dob,
        age,
        placeOfBirth,
        cellphoneNumber,
        email,
        gender,
        civilStatus,
        companyName,
        jobPosition,
        combinedId,
        coe,
        healthCard,
        birthCertificate,
        officialReceipt,
        orNumber,
        orExtension,
        orDate,
        orAmount,
        ctcNumber,
        ctcDateIssued,
        ctcPlaceIssued,
      ];

      // Insert the form data along with the binary files into the database
      await pool.query(query, values);
      res.status(200).json({ message: "Form submitted successfully!" });
    } catch (err) {
      console.error("Error inserting data:", err);
      res.status(500).json({ message: "Error submitting form" });
    }
  }
);

module.exports = router;
