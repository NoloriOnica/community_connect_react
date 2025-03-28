const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const path = require('path'); 

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes); // all routes under /api/
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));


module.exports = app;
