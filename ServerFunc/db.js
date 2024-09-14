const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', // or 192.168.5.59
  database: 'MTOPandOccupational_Permit',
  password: 'password',
  port: 5432,
});

module.exports = pool;
