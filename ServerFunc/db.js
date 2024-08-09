const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '192.168.5.59', // Removed the extra space
  database: 'MTOPandOccupational_Permit',
  password: 'password',
  port: 5432,
});

module.exports = pool;
