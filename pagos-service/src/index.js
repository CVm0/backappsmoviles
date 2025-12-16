const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const pagosRoutes = require('./routes/pagos.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/pagos', pagosRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'pagos-service' });
});

// Conexión a MongoDB (opcional - para guardar historial de pagos)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/huertabeja_pagos';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB conectado - Base de datos de Pagos'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servicio de Pagos corriendo en 0.0.0.0:${PORT}`);
  console.log(`Accesible desde la red local en: http://<TU_IP>:${PORT}`);
});

module.exports = app;
