require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const usuariosRoutes = require('./routes/usuarios.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos
connectDB();

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Usuarios Service' });
});

// Rutas
app.use('/api/usuarios', usuariosRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 Servicio de Usuarios corriendo en ${HOST}:${PORT}`);
  console.log(`📱 Accesible desde la red local en: http://<TU_IP>:${PORT}`);
});
