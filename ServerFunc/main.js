const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const loginProcessRouter = require('./LoginProcess');
const serverRouter = require('./server');
const FCRouter = require('./FranchiseProcess');
const OccuProcessRouter = require('./Occuprocess');

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use the LoginProcess router for login-related routes
app.use('/', loginProcessRouter);

// Use the ServerRouter for the other routes like signup
app.use('/', serverRouter);
app.use('/', FCRouter);
app.use('/', OccuProcessRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
