const Producto = require('../models/Producto');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

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

// @desc    Subir imagen a Cloudinary
// @route   POST /api/productos/upload
// @access  Private/Admin
exports.subirImagen = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ninguna imagen' });
    }

    // Subir imagen a Cloudinary usando un stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'huertabeja_productos',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Error al subir imagen a Cloudinary', details: error.message });
        }
        
        res.status(200).json({
          mensaje: 'Imagen subida exitosamente',
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    // Convertir buffer a stream y pipe a Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Eliminar imagen de Cloudinary
// @route   DELETE /api/productos/upload/:public_id
// @access  Private/Admin
exports.eliminarImagen = async (req, res) => {
  try {
    const { public_id } = req.params;
    
    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result === 'ok') {
      res.json({ mensaje: 'Imagen eliminada exitosamente' });
    } else {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
