// auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("./db"); // Assuming db.js exports a properly configured pool

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const userResult = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);
    const user = userResult.rows[0];
    
    if (!user) {
      return res.status(400).json({ message: "Invalid email and password Please Try again" });
    }

    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password Please Try again" });
    }

    // Success: User authenticated
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

module.exports = router;
