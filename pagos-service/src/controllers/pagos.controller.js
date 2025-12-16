const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

// Configurar Mercado Pago con Access Token
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Crear preferencia de pago (para Checkout Pro)
exports.crearPreferencia = async (req, res) => {
  try {
    const { items, payer, pedidoId, back_urls } = req.body;

    // Validar datos requeridos
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        error: 'Se requiere al menos un item para crear la preferencia' 
      });
    }

    const preference = new Preference(client);

    // Crear objeto de preferencia
    const preferenceData = {
      items: items.map(item => ({
        id: item.id || String(Date.now()),
        title: item.title,
        description: item.description || '',
        picture_url: item.picture_url || '',
        category_id: item.category_id || 'others',
        quantity: item.quantity,
        currency_id: 'CLP',
        unit_price: item.unit_price
      })),
      payer: payer ? {
        name: payer.name || '',
        surname: payer.surname || '',
        email: payer.email || '',
        phone: payer.phone ? {
          area_code: payer.phone.area_code || '',
          number: payer.phone.number || ''
        } : undefined,
        address: payer.address ? {
          street_name: payer.address.street_name || '',
          street_number: payer.address.street_number || '',
          zip_code: payer.address.zip_code || ''
        } : undefined
      } : undefined,
      back_urls: {
        success: back_urls?.success || 'huertabeja://payment/success',
        failure: back_urls?.failure || 'huertabeja://payment/failure',
        pending: back_urls?.pending || 'huertabeja://payment/pending'
      },
      auto_return: 'approved',
      external_reference: pedidoId || String(Date.now()),
      notification_url: process.env.WEBHOOK_URL || undefined,
      statement_descriptor: 'HUERTABEJA',
      expires: false
    };

    // Crear la preferencia en Mercado Pago
    const result = await preference.create({ body: preferenceData });

    console.log('Preferencia creada:', result.id);

    res.status(201).json({
      mensaje: 'Preferencia creada exitosamente',
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point
    });

  } catch (error) {
    console.error('Error creando preferencia:', error);
    res.status(500).json({ 
      error: 'Error al crear preferencia de pago',
      detalle: error.message 
    });
  }
};

// Consultar estado de un pago
exports.consultarPago = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ error: 'Se requiere el ID del pago' });
    }

    const payment = new Payment(client);
    const result = await payment.get({ id: paymentId });

    res.json({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      transaction_amount: result.transaction_amount,
      currency_id: result.currency_id,
      date_created: result.date_created,
      date_approved: result.date_approved,
      payment_method_id: result.payment_method_id,
      payment_type_id: result.payment_type_id,
      external_reference: result.external_reference
    });

  } catch (error) {
    console.error('Error consultando pago:', error);
    res.status(500).json({ 
      error: 'Error al consultar pago',
      detalle: error.message 
    });
  }
};

// Webhook para notificaciones de Mercado Pago
exports.webhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('Notificacion recibida:', type, data);

    if (type === 'payment') {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: data.id });

      console.log('Estado del pago:', paymentData.status);

      // Aquí puedes actualizar el estado del pedido en tu base de datos
      // Por ejemplo: actualizar el pedido con external_reference
    }

    res.sendStatus(200);

  } catch (error) {
    console.error('Error en webhook:', error);
    res.sendStatus(500);
  }
};

// Obtener métodos de pago disponibles
exports.metodosPago = async (req, res) => {
  try {
    // Métodos de pago disponibles en Chile
    const metodos = [
      { id: 'visa', name: 'Visa', type: 'credit_card' },
      { id: 'mastercard', name: 'Mastercard', type: 'credit_card' },
      { id: 'debvisa', name: 'Visa Débito', type: 'debit_card' },
      { id: 'debmaster', name: 'Mastercard Débito', type: 'debit_card' },
      { id: 'account_money', name: 'Dinero en cuenta Mercado Pago', type: 'account_money' }
    ];

    res.json({ metodos });

  } catch (error) {
    console.error('Error obteniendo metodos de pago:', error);
    res.status(500).json({ error: 'Error al obtener métodos de pago' });
  }
};
