require('dotenv').config();
const { Pool } = require('pg');

const idOrCode = process.argv[2] || process.env.DELETE_ID;
if (!idOrCode) {
  console.error('Provide id or codigo_acceso as first arg or DELETE_ID env var');
  process.exit(1);
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    let res;
    if (/^\d+$/.test(idOrCode)) {
      res = await pool.query('DELETE FROM clases_valentina WHERE id=$1 RETURNING *', [parseInt(idOrCode, 10)]);
    } else {
      res = await pool.query('DELETE FROM clases_valentina WHERE codigo_acceso=$1 RETURNING *', [idOrCode]);
    }
    console.log('deleted', JSON.stringify(res.rows[0] || null));
  } catch (err) {
    console.error('delete error', err.message || err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
