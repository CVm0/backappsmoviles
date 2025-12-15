const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuarioId: {
    type: String,
    required: [true, 'El ID del usuario es requerido']
  },
  productos: [{
    productoId: {
      type: String,
      required: true
    },
    nombre: {
      type: String,
      required: true
    },
    precio: {
      type: Number,
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  direccionEntrega: {
    calle: {
      type: String,
      required: true
    },
    ciudad: {
      type: String,
      required: true
    },
    estado: {
      type: String,
      required: true
    },
    codigoPostal: {
      type: String,
      required: true
    },
    pais: {
      type: String,
      required: true
    }
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  metodoPago: {
    type: String,
    enum: ['tarjeta', 'efectivo', 'transferencia', 'paypal'],
    required: true
  },
  estadoPago: {
    type: String,
    enum: ['pendiente', 'pagado', 'rechazado', 'reembolsado'],
    default: 'pendiente'
  },
  notas: {
    type: String,
    trim: true
  },
  fechaPedido: {
    type: Date,
    default: Date.now
  },
  fechaEntregaEstimada: {
    type: Date
  },
  fechaEntregaReal: {
    type: Date
  },
  historialEstados: [{
    estado: String,
    fecha: {
      type: Date,
      default: Date.now
    },
    comentario: String
  }]
}, {
  timestamps: true
});

// Calcular fecha estimada de entrega antes de guardar
pedidoSchema.pre('save', function(next) {
  if (this.isNew && !this.fechaEntregaEstimada) {
    const fechaEstimada = new Date();
    fechaEstimada.setDate(fechaEstimada.getDate() + 7); // 7 días por defecto
    this.fechaEntregaEstimada = fechaEstimada;
  }
  next();
});

module.exports = mongoose.model('Pedido', pedidoSchema);
