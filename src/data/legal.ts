export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
}

export const legalDocuments: LegalDocument[] = [
  {
    slug: 'aviso-de-privacidad',
    title: 'Aviso de privacidad',
    eyebrow: 'Legal',
    summary:
      'Cómo Buda Belleza S.A. de C.V. recaba, usa y protege los datos personales de sus clientes mayoristas.',
    updated: '1 de julio de 2026',
    sections: [
      {
        heading: 'Responsable',
        body: [
          'Buda Belleza S.A. de C.V., con domicilio en Av. Insurgentes Sur 1425, Col. Insurgentes Mixcoac, Ciudad de México, es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.',
        ],
      },
      {
        heading: 'Datos que recabamos',
        body: [
          'Para dar de alta una cuenta mayorista recabamos nombre del titular, nombre comercial, RFC, domicilio fiscal y de entrega, correo electrónico y teléfono de contacto.',
          'Para la operación de crédito podemos solicitar referencias comerciales y estados de cuenta. No recabamos datos personales sensibles.',
        ],
      },
      {
        heading: 'Finalidades',
        body: [
          'Finalidades primarias: validar tu alta como cliente mayorista, emitir cotizaciones y facturas CFDI 4.0, procesar y entregar pedidos, atender garantías y evaluar líneas de crédito.',
          'Finalidades secundarias: enviarte novedades de catálogo, invitaciones a capacitación y promociones por volumen. Puedes oponerte a estas últimas en cualquier momento sin que afecte tu cuenta.',
        ],
      },
      {
        heading: 'Transferencias',
        body: [
          'Compartimos datos de entrega con las empresas de paquetería que transportan tu pedido y datos fiscales con el SAT para el timbrado de comprobantes. No vendemos ni cedemos tus datos con fines comerciales a terceros.',
        ],
      },
      {
        heading: 'Derechos ARCO',
        body: [
          'Puedes solicitar el acceso, rectificación, cancelación u oposición al tratamiento de tus datos escribiendo a privacidad@budabelleza.mx desde el correo registrado en tu cuenta. Respondemos en un plazo máximo de 20 días hábiles.',
        ],
      },
      {
        heading: 'Cambios al aviso',
        body: [
          'Cualquier modificación se publicará en esta página con su fecha de actualización. Te recomendamos revisarla periódicamente.',
        ],
      },
    ],
  },
  {
    slug: 'terminos-de-venta',
    title: 'Términos de venta mayorista',
    eyebrow: 'Legal',
    summary:
      'Condiciones comerciales aplicables a toda compra realizada bajo una cuenta mayorista de Buda Belleza.',
    updated: '1 de julio de 2026',
    sections: [
      {
        heading: 'Quién puede comprar',
        body: [
          'La lista mayorista está reservada a negocios del sector belleza con actividad comprobable: salones, barberías, estudios de uñas, spas, tiendas especializadas y profesionales con cédula. El alta requiere RFC y evidencia del negocio, y se valida en un máximo de 24 horas hábiles.',
        ],
      },
      {
        heading: 'Precios y pedido mínimo',
        body: [
          'Los precios mostrados son mayoristas, en pesos mexicanos y no incluyen IVA ni costo de envío. El pedido mínimo es de $3,000 MXN.',
          'Los descuentos por volumen se aplican por SKU a partir de 6 piezas y escalan por caja completa. Los precios pueden cambiar sin previo aviso por ajustes de fábrica o tipo de cambio; el precio válido es el de la cotización confirmada.',
        ],
      },
      {
        heading: 'Formas de pago y crédito',
        body: [
          'Aceptamos tarjeta de crédito y débito, transferencia SPEI y efectivo en sucursal. Después de tres pedidos liquidados en tiempo puedes solicitar línea de crédito a 30 días, sujeta a revisión de historial y referencias comerciales.',
          'La falta de pago en la fecha pactada suspende la línea de crédito y genera intereses moratorios conforme al contrato de crédito firmado.',
        ],
      },
      {
        heading: 'Facturación',
        body: [
          'Emitimos CFDI 4.0 con los datos fiscales registrados en tu cuenta. Los cambios de datos fiscales deben notificarse antes de confirmar el pedido; una vez timbrada, la factura sólo puede cancelarse dentro del mismo mes calendario.',
        ],
      },
      {
        heading: 'Devoluciones y garantías',
        body: [
          'Aceptamos devolución de producto sellado, en su empaque original y sin etiquetas de precio, dentro de los 15 días naturales posteriores a la entrega. No se aceptan devoluciones de producto abierto, refrigerado o de temporada liquidada.',
          'El producto con defecto de fábrica se reemplaza sin costo dentro de la vigencia de su garantía. El equipo eléctrico se atiende por el centro de servicio autorizado de cada marca.',
        ],
      },
      {
        heading: 'Uso de marcas',
        body: [
          'La compra de producto no otorga licencia sobre las marcas que distribuimos. El uso de logotipos e imágenes de marca en tu publicidad requiere autorización escrita del titular correspondiente.',
        ],
      },
    ],
  },
  {
    slug: 'politica-de-envios',
    title: 'Política de envíos',
    eyebrow: 'Legal',
    summary:
      'Tiempos de surtido, cobertura, costos y qué hacer si tu pedido llega incompleto o dañado.',
    updated: '1 de julio de 2026',
    sections: [
      {
        heading: 'Tiempos de surtido',
        body: [
          'Los pedidos confirmados y pagados antes de las 14:00 horas se surten el mismo día hábil desde el centro de distribución más cercano. Los pedidos posteriores salen al día hábil siguiente.',
        ],
      },
      {
        heading: 'Cobertura y plazos',
        body: [
          'Zona metropolitana de la Ciudad de México, Guadalajara y Monterrey: ruta propia con entrega en 24 horas hábiles.',
          'Resto del país: paquetería nacional con entrega estimada entre 2 y 4 días hábiles. Las zonas extendidas pueden sumar un día adicional.',
        ],
      },
      {
        heading: 'Costos',
        body: [
          'El envío es sin costo en pedidos iguales o mayores a $6,000 MXN antes de IVA. Por debajo de ese monto se cobra la tarifa de paquetería vigente, que se muestra en la cotización antes de confirmar.',
          'El mobiliario y el equipo voluminoso cotizan flete por separado según destino.',
        ],
      },
      {
        heading: 'Recolección en sucursal',
        body: [
          'Puedes recoger sin costo en cualquiera de nuestras tres sucursales. Te avisamos por WhatsApp cuando el pedido esté listo; lo resguardamos hasta por 5 días hábiles.',
        ],
      },
      {
        heading: 'Pedido incompleto o dañado',
        body: [
          'Revisa tu pedido al momento de recibirlo. Reporta faltantes o daño de transporte dentro de las 48 horas siguientes a la entrega, con fotografía del empaque y del comprobante, a ventas@budabelleza.mx o por WhatsApp.',
          'Reemplazamos la pieza afectada sin costo en el siguiente envío programado o la abonamos a tu cuenta, según prefieras.',
        ],
      },
    ],
  },
];

export function getLegalDocument(slug: string) {
  return legalDocuments.find((document) => document.slug === slug);
}
