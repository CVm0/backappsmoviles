const Pedido = require('../models/Pedido');
const axios = require('axios');

// @desc    Crear un nuevo pedido
// @route   POST /api/pedidos
// @access  Private
exports.crearPedido = async (req, res) => {
  try {
    const { usuarioId, productos, direccionEntrega, metodoPago, notas } = req.body;

    // Verificar que el usuario existe (llamada al microservicio de usuarios)
    try {
      await axios.get(`${process.env.USUARIOS_SERVICE_URL}/api/usuarios/perfil/${usuarioId}`);
    } catch (error) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar productos y calcular total
    let total = 0;
    const productosVerificados = [];

    for (const item of productos) {
      try {
        const response = await axios.get(
          `${process.env.PRODUCTOS_SERVICE_URL}/api/productos/${item.productoId}`
        );
        
        const producto = response.data;
        
        // Verificar stock disponible
        if (producto.stock < item.cantidad) {
          return res.status(400).json({ 
            error: `Stock insuficiente para el producto ${producto.nombre}` 
          });
        }

        const subtotal = producto.precio * item.cantidad;
        total += subtotal;

        productosVerificados.push({
          productoId: producto._id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: item.cantidad,
          subtotal
        });

        // Actualizar stock del producto
        await axios.patch(
          `${process.env.PRODUCTOS_SERVICE_URL}/api/productos/${item.productoId}/stock`,
          { cantidad: producto.stock - item.cantidad }
        );

      } catch (error) {
        return res.status(404).json({ 
          error: `Producto con ID ${item.productoId} no encontrado` 
        });
      }
    }

    // Crear el pedido
    const pedido = await Pedido.create({
      usuarioId,
      productos: productosVerificados,
      direccionEntrega,
      total,
      metodoPago,
      notas,
      historialEstados: [{
        estado: 'pendiente',
        comentario: 'Pedido creado'
      }]
    });

    res.status(201).json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Obtener todos los pedidos
// @route   GET /api/pedidos
// @access  Private/Admin
exports.obtenerPedidos = async (req, res) => {
  try {
    const { estado, pagina = 1, limite = 10 } = req.query;
    
    let filtro = {};
    if (estado) {
      filtro.estado = estado;
    }

    const pedidos = await Pedido.find(filtro)
      .limit(limite * 1)
      .skip((pagina - 1) * limite)
      .sort({ fechaPedido: -1 });
    
    const total = await Pedido.countDocuments(filtro);

    res.json({
      pedidos,
      paginaActual: parseInt(pagina),
      totalPaginas: Math.ceil(total / limite),
      totalPedidos: total
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Obtener un pedido por ID
// @route   GET /api/pedidos/:id
// @access  Private
exports.obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Obtener pedidos de un usuario
// @route   GET /api/pedidos/usuario/:usuarioId
// @access  Private
exports.obtenerPedidosPorUsuario = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuarioId: req.params.usuarioId })
      .sort({ fechaPedido: -1 });
    
    res.json(pedidos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Actualizar estado del pedido
// @route   PATCH /api/pedidos/:id/estado
// @access  Private/Admin
exports.actualizarEstadoPedido = async (req, res) => {
  try {
    const { estado, comentario } = req.body;
    const pedido = await Pedido.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    pedido.estado = estado;
    pedido.historialEstados.push({
      estado,
      comentario: comentario || `Estado actualizado a ${estado}`
    });

    // Si el estado es entregado, actualizar fecha de entrega real
    if (estado === 'entregado') {
      pedido.fechaEntregaReal = new Date();
    }

    await pedido.save();
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Cancelar pedido
// @route   PATCH /api/pedidos/:id/cancelar
// @access  Private
exports.cancelarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (pedido.estado === 'entregado') {
      return res.status(400).json({ error: 'No se puede cancelar un pedido ya entregado' });
    }

    if (pedido.estado === 'enviado') {
      return res.status(400).json({ error: 'No se puede cancelar un pedido ya enviado' });
    }

    // Devolver stock a los productos
    for (const item of pedido.productos) {
      try {
        const response = await axios.get(
          `${process.env.PRODUCTOS_SERVICE_URL}/api/productos/${item.productoId}`
        );
        
        const producto = response.data;
        await axios.patch(
          `${process.env.PRODUCTOS_SERVICE_URL}/api/productos/${item.productoId}/stock`,
          { cantidad: producto.stock + item.cantidad }
        );
      } catch (error) {
        console.error(`Error al devolver stock del producto ${item.productoId}`);
      }
    }

    pedido.estado = 'cancelado';
    pedido.historialEstados.push({
      estado: 'cancelado',
      comentario: req.body.motivo || 'Pedido cancelado por el usuario'
    });

    await pedido.save();
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Obtener estadísticas de pedidos
// @route   GET /api/pedidos/estadisticas/resumen
// @access  Private/Admin
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const totalPedidos = await Pedido.countDocuments();
    const pedidosPendientes = await Pedido.countDocuments({ estado: 'pendiente' });
    const pedidosProcesando = await Pedido.countDocuments({ estado: 'procesando' });
    const pedidosEnviados = await Pedido.countDocuments({ estado: 'enviado' });
    const pedidosEntregados = await Pedido.countDocuments({ estado: 'entregado' });
    const pedidosCancelados = await Pedido.countDocuments({ estado: 'cancelado' });

    // Calcular ingresos totales de pedidos entregados
    const resultado = await Pedido.aggregate([
      { $match: { estado: 'entregado' } },
      { $group: { _id: null, totalIngresos: { $sum: '$total' } } }
    ]);

    const totalIngresos = resultado.length > 0 ? resultado[0].totalIngresos : 0;

    res.json({
      totalPedidos,
      pedidosPendientes,
      pedidosProcesando,
      pedidosEnviados,
      pedidosEntregados,
      pedidosCancelados,
      totalIngresos
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
