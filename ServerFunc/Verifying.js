const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session'); // Add session middleware
const pool = require('./db');
const router = express.Router();
const pgSession = require('connect-pg-simple')(session);


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session' // Customize session table name
    }),
    secret: process.env.SESSION_SECRET || 'aV3ryC0mpl3xP@ssphr@se1234!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: true // Set to true in production
    }
}));


// Route to get records
router.get('/getRecords', (req, res) => {
    const sqlQuery = `
        SELECT 
            tf.tfid, 
            tf.applicationtype, 
            tf.nameapplicant, 
            tf.applicationdate, 
            tf.route, 
            tf.barangay, 
            tf.municipality, 
            tf.province, 
            tf.occupation, 
            tf.typeownership,
            tf.numunits, 
            tf.officialdriver, 
            tf.licensenumber, 
            tf.certificationdate, 
            encode(tf.signatureapplicant, 'base64') as signatureapplicant,
            tf.subscribedday, 
            tf.subscribedmonth, 
            tf.subscribedyear, 
            tf.communitytaxcertno, 
            tf.inspectedby, 
            STRING_AGG(tu.unit_name, ', ') AS unit_names,
            STRING_AGG(tu.unit_model, ', ') AS unit_models,
            STRING_AGG(tu.motor_no, ', ') AS motor_numbers,
            STRING_AGG(tu.chassis_no, ', ') AS chassis_numbers,
            STRING_AGG(tu.plate_no, ', ') AS plate_numbers,
            s.status  
        FROM 
            tricyclefranchise tf
        LEFT JOIN 
            tricycleunits tu ON tf.tfid = tu.tfid
        LEFT JOIN
            status s ON tf.tfid = s.tfid  
        GROUP BY 
            tf.tfid, 
            tf.applicationtype, 
            tf.nameapplicant, 
            tf.applicationdate, 
            tf.route, 
            tf.barangay, 
            tf.municipality, 
            tf.province, 
            tf.occupation, 
            tf.typeownership,
            tf.numunits, 
            tf.officialdriver, 
            tf.licensenumber, 
            tf.certificationdate, 
            tf.subscribedday, 
            tf.subscribedmonth, 
            tf.subscribedyear, 
            tf.communitytaxcertno, 
            tf.inspectedby,
            s.status  
        ORDER BY 
            tf.tfid;
    `;

    pool.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            return res.status(500).send('Error fetching data');
        }
        if (results.rows.length === 0) {
            return res.status(404).send('No records found');
        }
        res.json(results.rows);
    });
});

// Route to update status
router.post('/updateStatus', (req, res) => {
    console.log('Full session object:', req.session);
    const { tfid, status } = req.body;

  


    // Get processed_by information from the session
    const processedBy = (req.session.firstname || '').trim() + ' ' + (req.session.lastname || '').trim();


    // Log the processedBy and session info
    console.log('Processed by:', processedBy);
    console.log('Session:', req.session);

    // SQL query to update the status of the given tfid
    const sqlUpdate = `
        UPDATE status 
        SET status = $1, processed_by = $2
        WHERE tfid = $3;
    `;

    // Execute the update query
    pool.query(sqlUpdate, [status, processedBy, tfid], (err, result) => {
        if (err) {
            console.error('Error executing update query:', err.message);
            return res.status(500).send('Error updating status');
        }
        res.json({ message: 'Status updated successfully' });
    });
});

module.exports = router;
