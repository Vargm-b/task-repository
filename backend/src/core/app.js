const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500']
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api', routes);

module.exports = app;