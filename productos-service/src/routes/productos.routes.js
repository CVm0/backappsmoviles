const express = require('express');
const router = express.Router();
const {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  actualizarStock,
  obtenerProductosPorCategoria,
  subirImagen,
  eliminarImagen
} = require('../controllers/productos.controller');
const upload = require('../config/multer');

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/categoria/:categoria', obtenerProductosPorCategoria);
router.get('/:id', obtenerProductoPorId);

// Rutas privadas (requieren autenticación/admin)
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);
router.patch('/:id/stock', actualizarStock);

// Rutas de upload de imágenes
router.post('/upload', upload.single('imagen'), subirImagen);
router.delete('/upload/:public_id', eliminarImagen);

module.exports = router;
