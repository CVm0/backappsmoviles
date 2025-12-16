const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['Interior', 'Exterior']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  imagenes: [{
    type: String
  }],
  marca: {
    type: String,
    trim: true
  },
  especificaciones: {
    type: Map,
    of: String
  },
  descuento: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  disponible: {
    type: Boolean,
    default: true
  },
  valoracion: {
    promedio: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numeroReviews: {
      type: Number,
      default: 0
    }
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índice para búsquedas
productoSchema.index({ nombre: 'text', descripcion: 'text' });

module.exports = mongoose.model('Producto', productoSchema);
