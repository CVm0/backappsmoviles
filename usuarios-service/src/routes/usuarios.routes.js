const express = require('express');
const router = express.Router();
const {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarPerfil,
  obtenerUsuarios,
  eliminarUsuario
} = require('../controllers/usuarios.controller');

// Rutas públicas
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);

// Rutas privadas (requieren autenticación)
router.get('/perfil/:id', obtenerPerfil);
router.put('/perfil/:id', actualizarPerfil);
router.get('/', obtenerUsuarios);
router.delete('/:id', eliminarUsuario);

module.exports = router;
