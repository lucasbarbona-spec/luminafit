// Configuración de localización para República Argentina
export const ArgentinaConfig = {
  // Información del país
  country: {
    name: 'Argentina',
    code: 'AR',
    currency: 'ARS',
    language: 'es-AR',
    timezone: 'America/Argentina/Buenos_Aires',
    phoneCode: '+54',
  },

  // Configuración de moneda
  currency: {
    code: 'ARS',
    symbol: '$',
    name: 'Peso Argentino',
    decimalDigits: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
    symbolPosition: 'before', // antes del número
  },

  // Formato de números
  numberFormat: {
    thousandsSeparator: '.',
    decimalSeparator: ',',
    decimalDigits: 2,
  },

  // Formato de fecha y hora
  dateTime: {
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    dateTimeFormat: 'DD/MM/YYYY HH:mm',
    longDateFormat: 'DD [de] MMMM [de] YYYY',
    longDateTimeFormat: 'DD [de] MMMM [de] YYYY HH:mm',
    months: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthsShort: [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ],
    days: [
      'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ],
    daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  },

  // Configuración de impuestos
  taxes: {
    iva: {
      rate: 0.21, // 21% IVA en Argentina
      name: 'IVA',
      description: 'Impuesto al Valor Agregado',
    },
    ganancias: {
      rate: 0.35, // Tasa aproximada
      name: 'Impuesto a las Ganancias',
      description: 'Impuesto sobre los ingresos',
    },
    ingresosBrutos: {
      rate: 0.03, // 3% aproximadamente, varía por provincia
      name: 'Ingresos Brutos',
      description: 'Impuesto provincial sobre los ingresos',
    },
  },

  // Métodos de pago locales
  paymentMethods: [
    {
      id: 'transferencia',
      name: 'Transferencia Bancaria',
      description: 'Transferencia entre cuentas bancarias',
      icon: 'bank',
      popular: true,
    },
    {
      id: 'debito',
      name: 'Tarjeta de Débito',
      description: 'Tarjeta de débito Visa/Mastercard',
      icon: 'card',
      popular: true,
    },
    {
      id: 'credito',
      name: 'Tarjeta de Crédito',
      description: 'Tarjeta de crédito en cuotas',
      icon: 'credit-card',
      popular: true,
    },
    {
      id: 'mercado-pago',
      name: 'Mercado Pago',
      description: 'Wallet digital más popular',
      icon: 'wallet',
      popular: true,
    },
    {
      id: 'efectivo',
      name: 'Efectivo',
      description: 'Pago en efectivo',
      icon: 'cash',
      popular: false,
    },
    {
      id: 'cheque',
      name: 'Cheque',
      description: 'Cheque bancario',
      icon: 'document',
      popular: false,
    },
  ],

  // Planes de suscripción locales
  subscriptionPlans: [
    {
      id: 'basico',
      name: 'Plan Básico',
      price: 2500, // $2.500 ARS
      currency: 'ARS',
      billing: 'monthly',
      features: [
        'Hasta 20 alumnos',
        'Rutinas básicas',
        'Seguimiento simple',
        'Soporte por email',
      ],
      popular: false,
    },
    {
      id: 'profesional',
      name: 'Plan Profesional',
      price: 5500, // $5.500 ARS
      currency: 'ARS',
      billing: 'monthly',
      features: [
        'Hasta 50 alumnos',
        'Rutinas avanzadas',
        'Análisis de progreso',
        'Soporte prioritario',
        'App móvil',
      ],
      popular: true,
    },
    {
      id: 'empresarial',
      name: 'Plan Empresarial',
      price: 12000, // $12.000 ARS
      currency: 'ARS',
      billing: 'monthly',
      features: [
        'Alumnos ilimitados',
        'Todas las funcionalidades',
        'API personalizada',
        'Soporte 24/7',
        'White label',
      ],
      popular: false,
    },
  ],

  // Terminología local
  terminology: {
    trainer: 'Entrenador',
    student: 'Alumno',
    client: 'Cliente',
    routine: 'Rutina',
    workout: 'Entrenamiento',
    exercise: 'Ejercicio',
    progress: 'Progreso',
    schedule: 'Horario',
    session: 'Sesión',
    plan: 'Plan',
    subscription: 'Suscripción',
    payment: 'Pago',
    invoice: 'Factura',
    receipt: 'Comprobante',
  },

  // Configuración regional
  regional: {
    workingDays: [1, 2, 3, 4, 5], // Lunes a Viernes
    workingHours: {
      start: '08:00',
      end: '20:00',
    },
    holidays: [
      // Feriados nacionales argentinos (ejemplos)
      { date: '01-01', name: 'Año Nuevo' },
      { date: '25-05', name: 'Día de la Revolución de Mayo' },
      { date: '25-12', name: 'Navidad' },
    ],
    provinces: [
      'Buenos Aires',
      'CABA',
      'Córdoba',
      'Santa Fe',
      'Mendoza',
      'Tucumán',
      'Entre Ríos',
      'Salta',
      'Misiones',
      'Chaco',
      'Corrientes',
      'Neuquén',
      'Río Negro',
      'Formosa',
      'Chubut',
      'San Juan',
      'Jujuy',
      'La Pampa',
      'Santiago del Estero',
      'San Luis',
      'Catamarca',
      'La Rioja',
      'Santa Cruz',
      'Tierra del Fuego',
    ],
  },
};

export default ArgentinaConfig;
