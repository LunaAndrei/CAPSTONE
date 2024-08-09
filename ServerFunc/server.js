const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const pool = require('./db');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/signup_process', async (req, res) => {
  const { Firstname, Lastname, Role, email, password } = req.body;
  const UserID = uuidv4();
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO public."Admin" (id, firstname, "Lastname", email, password, "Role") 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [UserID, Firstname, Lastname, email, hashedPassword, Role];

    const result = await pool.query(query, values);
    console.log('User added:', result.rows[0]);
    res.status(200).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
