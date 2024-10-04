const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const loginProcessRouter = require('./LoginProcess');
const serverRouter = require('./server');

const FCRouter = require('./FranchiseProcess');
const OccuProcessRouter = require('./Occuprocess');
const VerifyingRouter = require('./Verifying');
const pool = require('./db');
const cors = require('cors');


const app = express();
const port = 8000;

// Use bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:8000',
    credentials: true
}));

// Use session middleware with PostgreSQL session store



// Use routers for different routes
app.use('/', loginProcessRouter);
app.use('/', serverRouter);
app.use('/', FCRouter);
app.use('/', OccuProcessRouter);
app.use('/', VerifyingRouter); // Ensure this router does not conflict with others

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
