const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
});

const app = require('./core/app');

const PORT = 4100;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});