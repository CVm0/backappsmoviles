const express = require('express');
const router = express.Router();
const {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  actualizarStock,
  obtenerProductosPorCategoria
} = require('../controllers/productos.controller');

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/categoria/:categoria', obtenerProductosPorCategoria);
router.get('/:id', obtenerProductoPorId);

// Rutas privadas (requieren autenticación/admin)
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);
router.patch('/:id/stock', actualizarStock);

module.exports = router;
