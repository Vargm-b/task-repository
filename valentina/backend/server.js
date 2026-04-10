// Servidor básico para Sprint 0
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Servidor backend de Valentina' });
});

app.get('/clases', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clases_valentina ORDER BY id DESC LIMIT 100');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error consultando la base de datos' });
  }
});

// Ruta POST para la Tarea T11.4: Guardar la clase y generar su código
app.post('/api/clases', async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const codigoAcceso = Math.random().toString(36).substring(2, 8).toUpperCase();

    const insertQuery = `
      INSERT INTO clases_valentina (nombre, descripcion, codigo_acceso) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, [nombre, descripcion, codigoAcceso]);

    return res.status(201).json({
      status: 'success',
      mensaje: `Clase '${nombre}' guardada con el código: ${codigoAcceso}`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al guardar la clase:', error);
    res.status(500).json({ status: 'error', mensaje: 'Error en el servidor al guardar la clase' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));

module.exports = app;
