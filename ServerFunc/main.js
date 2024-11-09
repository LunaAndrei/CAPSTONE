const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const loginProcessRouter = require('./LoginProcess');
const serverRouter = require('./server');
const FCRouter = require('./FranchiseProcess');
const OccuProcessRouter = require('./Occuprocess');
const VerifyingRouter = require('./Verifying');
const HeadadminRouter = require('./HeadadminLogin');
const AdminChangPass = require('./AdminChangPass');
const PasswordReset = require('./PasswordReset');
const InspectorSignup = require('./InspectorSignup');
const inspectorchangepass = require('./inspectorchangepass');
const inspectorchangepass2 = require('./inspectorchangepass2');
const HeadadminAccountRouter = require('./HeadAdminaccount');
const Analysis = require('./Analysis');
const occupational = require("./occupational");
const SubmissionOccu = require("./SubmissionOccu")
const OccupationalApplicants = require("./OccupationalApplicants");
const Occustatus = require("./Occustatus");
const pool = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Occuformhandler = require("./Occuformhandler");
require('dotenv').config(); // Load environment variables from .env

// Initialize Express app
const app = express();

// Use cookie-parser middleware
app.use(cookieParser());

// Port configuration
const port = process.env.PORT || 8000;

// Use bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:8000', // Adjust this to your front-end's URL if different
    credentials: true
}));

// Session for general app (existing session configuration for 'session' table)
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session' // Existing session table for general login activities
    }),
    secret: process.env.SESSION_SECRET || 'aV3ryC0mpl3xP@ssphr@se1234!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration (30 days)
        secure: false // Set to true in production with HTTPS
    }
}));

// Session for permit-related routes (using 'permit_session' table)
const permitSession = session({
    store: new pgSession({
        pool: pool,
        tableName: 'permit_session' // New session table specifically for OccuPermit-related sessions
    }),
    secret: process.env.SESSION_SECRET || 'aV3ryC0mpl3xP@ssphr@se1234!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: false
    }
});

// Use routers for different routes
app.use('/', loginProcessRouter);  // Login related routes
app.use('/', serverRouter);  // Other server routes
app.use('/', FCRouter);  // Franchise routes
app.use('/', OccuProcessRouter);  // Occupation process routes
app.use('/', VerifyingRouter);  // Verifying routes
app.use('/', HeadadminRouter);  // Head admin login routes
app.use('/', AdminChangPass);
app.use('/', PasswordReset);
app.use('/', inspectorchangepass);
app.use('/', inspectorchangepass2);
app.use('/', InspectorSignup);
app.use('/', HeadadminAccountRouter);
app.use('/data', Analysis); 
app.use("/signup", occupational);
app.use("/auth", OccupationalApplicants);
app.use('/', SubmissionOccu)

// Apply the `permitSession` middleware specifically to OccuPermit-related routes
app.use("/submit", permitSession, Occuformhandler); // Use `permitSession` for form submission
app.use("/status", permitSession, Occustatus); // Use `permitSession` for checking OccuPermit status
app.get('/test-session', permitSession, (req, res) => {
    if (req.session.occuid) {
        res.send(`Session occuid: ${req.session.occuid}`);
    } else {
        res.send('No occuid in session');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
