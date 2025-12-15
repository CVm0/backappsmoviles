const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Generar JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/usuarios/registro
// @access  Public
exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono, direccion } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      telefono,
      direccion
    });

    if (usuario) {
      res.status(201).json({
        _id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
        token: generarToken(usuario._id)
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Login de usuario
// @route   POST /api/usuarios/login
// @access  Public
exports.loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario y incluir password
    const usuario = await Usuario.findOne({ email }).select('+password');

    if (usuario && (await usuario.compararPassword(password))) {
      res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        token: generarToken(usuario._id)
      });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Obtener perfil de usuario
// @route   GET /api/usuarios/perfil/:id
// @access  Private
exports.obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/usuarios/perfil/:id
// @access  Private
exports.actualizarPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const camposActualizar = ['nombre', 'apellido', 'telefono', 'direccion'];
    camposActualizar.forEach(campo => {
      if (req.body[campo]) {
        usuario[campo] = req.body[campo];
      }
    });

    const usuarioActualizado = await usuario.save();

    res.json({
      _id: usuarioActualizado._id,
      nombre: usuarioActualizado.nombre,
      apellido: usuarioActualizado.apellido,
      email: usuarioActualizado.email,
      telefono: usuarioActualizado.telefono,
      direccion: usuarioActualizado.direccion
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Obtener todos los usuarios (admin)
// @route   GET /api/usuarios
// @access  Private/Admin
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    res.json(usuarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/usuarios/:id
// @access  Private/Admin
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.deleteOne();
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
