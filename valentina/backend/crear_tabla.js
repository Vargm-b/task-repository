// Importamos las librerías necesarias
require('dotenv').config();
const { Pool } = require('pg');

// Configuramos la conexión con las credenciales de tu .env
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false } // Importante para Supabase
});

// Escribimos la consulta SQL para crear tu tabla
const crearTablaQuery = `
    CREATE TABLE IF NOT EXISTS clases_valentina (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        codigo_acceso VARCHAR(10) UNIQUE NOT NULL,
        creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// Función para ejecutar la consulta
async function ejecutarScript() {
    try {
        console.log("Conectando a la base de datos grupal...");
        await pool.query(crearTablaQuery);
        console.log("✅ ¡Éxito! La tabla 'clases_valentina' ha sido creada en Supabase.");
    } catch (error) {
        console.error("❌ Error al crear la tabla:", error.message);
    } finally {
        // Cerramos la conexión para que la terminal no se quede colgada
        pool.end(); 
    }
}

// Llamamos a la función
ejecutarScript();
