const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const authRoutes = require('./src/routes/authRoutes');

//Public
app.use('/api/customer', authRoutes);


module.exports = app;
