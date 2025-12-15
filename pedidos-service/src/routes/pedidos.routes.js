const express = require('express');
const router = express.Router();
const {
  crearPedido,
  obtenerPedidos,
  obtenerPedidoPorId,
  obtenerPedidosPorUsuario,
  actualizarEstadoPedido,
  cancelarPedido,
  obtenerEstadisticas
} = require('../controllers/pedidos.controller');

// Rutas de pedidos
router.post('/', crearPedido);
router.get('/', obtenerPedidos);
router.get('/estadisticas/resumen', obtenerEstadisticas);
router.get('/usuario/:usuarioId', obtenerPedidosPorUsuario);
router.get('/:id', obtenerPedidoPorId);
router.patch('/:id/estado', actualizarEstadoPedido);
router.patch('/:id/cancelar', cancelarPedido);

module.exports = router;
