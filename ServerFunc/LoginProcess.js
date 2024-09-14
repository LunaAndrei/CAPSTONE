const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const pool = require('./db');
const path = require('path');
const router = express.Router();


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cors());

// Serve static files from the CAPSTONE directory
router.use(express.static(path.join(__dirname, '..')));

// Serve static files from the CAPSTONE directory explicitly
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'login.html'));
});

router.get('/Dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Dashboard.html'));
});

// Handle POST request for login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email, password });

  try {
    const query = 'SELECT * FROM "AdminStaff" WHERE email = $1';
    const values = [email];

    const result = await pool.query(query, values);

    console.log('Query result:', result.rows);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password.trim();
      console.log('Trimmed stored password:', storedPassword);

      const match = await bcrypt.compare(password, storedPassword);

      console.log('Password comparison:', {
        providedPassword: password,
        storedHash: storedPassword,
        matchResult: match
      });

      if (match) {
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
