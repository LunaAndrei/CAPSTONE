const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db'); 
const router = express.Router();

const app = express(); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); 

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
            res.status(500).send('Error fetching data');
        } else if (results.rows.length === 0) {
            res.status(404).send('No records found');
        } else {
            res.json(results.rows);
        }
    });
});

router.post('/updateStatus', (req, res) => {
    const { tfid, status } = req.body; 
    
    const sqlUpdate = `
        UPDATE status 
        SET status = $1 
        WHERE tfid = $2;
    `;
    
    pool.query(sqlUpdate, [status, tfid], (err, result) => {
        if (err) {
            console.error('Error executing update query:', err.message);
            return res.status(500).send('Error updating status');
        }
        res.json({ message: 'Status updated successfully' });
    });
});

module.exports = router;
