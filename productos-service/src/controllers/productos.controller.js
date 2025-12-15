const Producto = require('../models/Producto');

// @desc    Crear un nuevo producto
// @route   POST /api/productos
// @access  Private/Admin
exports.crearProducto = async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Obtener todos los productos
// @route   GET /api/productos
// @access  Public
exports.obtenerProductos = async (req, res) => {
  try {
    const { categoria, disponible, buscar, pagina = 1, limite = 10 } = req.query;
    
    let filtro = {};
    
    if (categoria) {
      filtro.categoria = categoria;
    }
    
    if (disponible !== undefined) {
      filtro.disponible = disponible === 'true';
    }
    
    if (buscar) {
      filtro.$text = { $search: buscar };
    }

    const productos = await Producto.find(filtro)
      .limit(limite * 1)
      .skip((pagina - 1) * limite)
      .sort({ fechaCreacion: -1 });
    
    const total = await Producto.countDocuments(filtro);

    res.json({
      productos,
      paginaActual: parseInt(pagina),
      totalPaginas: Math.ceil(total / limite),
      totalProductos: total
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/productos/:id
// @access  Public
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/productos/:id
// @access  Private/Admin
exports.actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/productos/:id
// @access  Private/Admin
exports.eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await producto.deleteOne();
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Actualizar stock de producto
// @route   PATCH /api/productos/:id/stock
// @access  Private
exports.actualizarStock = async (req, res) => {
  try {
    const { cantidad } = req.body;
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    producto.stock = cantidad;
    producto.disponible = cantidad > 0;
    
    await producto.save();
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Obtener productos por categoría
// @route   GET /api/productos/categoria/:categoria
// @access  Public
exports.obtenerProductosPorCategoria = async (req, res) => {
  try {
    const productos = await Producto.find({ 
      categoria: req.params.categoria,
      disponible: true 
    });
    res.json(productos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
