const express = require('express');
const router = express.Router();
const {
  crearPreferencia,
  consultarPago,
  webhook,
  metodosPago
} = require('../controllers/pagos.controller');

// POST /api/pagos/preferencia - Crear preferencia de pago
router.post('/preferencia', crearPreferencia);

// GET /api/pagos/pago/:paymentId - Consultar estado de pago
router.get('/pago/:paymentId', consultarPago);

// POST /api/pagos/webhook - Webhook de notificaciones
router.post('/webhook', webhook);

// GET /api/pagos/metodos - Obtener métodos de pago
router.get('/metodos', metodosPago);

module.exports = router;
