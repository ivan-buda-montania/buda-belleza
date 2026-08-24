import { IMG } from '../lib/images';
import type { Branch, Faq, ProcessStep, Stat, Testimonial } from '../types/institutional';

export const stats: Stat[] = [
  {
    id: 'anos',
    value: 18,
    prefix: '+',
    label: 'Años distribuyendo',
    detail: 'Operando de forma ininterrumpida desde 2007.',
  },
  {
    id: 'marcas',
    value: 82,
    prefix: '+',
    label: 'Marcas en catálogo',
    detail: 'Nacionales e importadas, 6 de ellas en exclusiva.',
  },
  {
    id: 'skus',
    value: 4500,
    prefix: '+',
    label: 'SKUs en almacén',
    detail: 'Inventario propio en dos centros de distribución.',
  },
  {
    id: 'clientes',
    value: 3200,
    prefix: '+',
    label: 'Negocios abastecidos',
    detail: 'Salones, barberías y estudios en 31 estados.',
  },
];

export const deliveryStats: Stat[] = [
  {
    id: 'entrega',
    value: 24,
    suffix: ' h',
    label: 'Surtido de pedido',
    detail: 'Pedidos confirmados antes de las 14:00 salen el mismo día.',
  },
  {
    id: 'cobertura',
    value: 31,
    label: 'Estados con cobertura',
    detail: 'Paquetería nacional y ruta propia en zona metropolitana.',
  },
  {
    id: 'fill',
    value: 97,
    suffix: '%',
    label: 'Nivel de surtido',
    detail: 'Promedio de líneas completas por pedido en el último año.',
  },
];

export const processSteps: ProcessStep[] = [
  {
    id: 'registro',
    step: '01',
    title: 'Registra tu negocio',
    description:
      'Envíanos el nombre comercial, RFC y una foto de tu establecimiento o cédula profesional.',
    icon: 'ClipboardList',
  },
  {
    id: 'validacion',
    step: '02',
    title: 'Validamos tu alta',
    description:
      'En menos de 24 horas hábiles activamos tu cuenta y te asignamos un asesor comercial.',
    icon: 'ShieldCheck',
  },
  {
    id: 'cotizacion',
    step: '03',
    title: 'Arma tu cotización',
    description:
      'Cotiza en línea o por WhatsApp con la lista mayorista y los descuentos por volumen ya aplicados.',
    icon: 'FileText',
  },
  {
    id: 'entrega',
    step: '04',
    title: 'Recibe o recoge',
    description:
      'Entrega a domicilio en todo México o recolección el mismo día en cualquier sucursal.',
    icon: 'Truck',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 't-1',
    quote:
      'Pasamos de trabajar con cuatro proveedores a uno solo. La lista mayorista y el crédito a 30 días nos ordenaron el flujo del salón por completo.',
    author: 'Mariana Olvera',
    role: 'Directora',
    business: 'Estudio Olvera',
    city: 'Ciudad de México',
    avatarId: IMG.faceA,
    yearsAsClient: 7,
  },
  {
    id: 't-2',
    quote:
      'Abrimos la segunda barbería con su paquete de apertura. Llegó todo en una sola entrega, montado y con la garantía en orden.',
    author: 'Diego Fuentes',
    role: 'Socio fundador',
    business: 'Fuentes Barber Club',
    city: 'Monterrey',
    avatarId: IMG.faceD,
    yearsAsClient: 4,
  },
  {
    id: 't-3',
    quote:
      'El nivel de surtido es lo que más valoro. En temporada alta nunca me han dejado sin decolorante ni sin oxidante, que es donde uno se cae.',
    author: 'Paulina Reyes',
    role: 'Colorista técnica',
    business: 'Casa Reyes Color Bar',
    city: 'Guadalajara',
    avatarId: IMG.faceB,
    yearsAsClient: 6,
  },
  {
    id: 't-4',
    quote:
      'Mi asesora conoce mi inventario mejor que yo. Me avisa antes de que se me acabe algo y me arma la compra por volumen.',
    author: 'Ximena Cortés',
    role: 'Propietaria',
    business: 'Nube Nail Studio',
    city: 'Puebla',
    avatarId: IMG.faceC,
    yearsAsClient: 3,
  },
];

export const branches: Branch[] = [
  {
    id: 'cdmx',
    city: 'Ciudad de México',
    state: 'CDMX',
    address: 'Av. Insurgentes Sur 1425, Col. Insurgentes Mixcoac',
    phone: '+52 55 4321 8800',
    hours: 'Lun a Vie 9:00–19:00 · Sáb 9:00–15:00',
    distributionCenter: true,
  },
  {
    id: 'gdl',
    city: 'Guadalajara',
    state: 'Jalisco',
    address: 'Av. Vallarta 2440, Col. Arcos Vallarta',
    phone: '+52 33 1820 4410',
    hours: 'Lun a Vie 9:00–19:00 · Sáb 9:00–14:00',
  },
  {
    id: 'mty',
    city: 'Monterrey',
    state: 'Nuevo León',
    address: 'Av. Gonzalitos 320, Col. Mitras Centro',
    phone: '+52 81 2299 6070',
    hours: 'Lun a Vie 9:00–19:00 · Sáb 9:00–14:00',
    distributionCenter: true,
  },
];

export const faqs: Faq[] = [
  {
    id: 'faq-alta',
    question: '¿Qué necesito para comprar a precio mayorista?',
    answer:
      'Nombre comercial, RFC y un comprobante de que operas un negocio de belleza: fotografía del local, cédula profesional o tarjeta de presentación. Validamos el alta en menos de 24 horas hábiles.',
  },
  {
    id: 'faq-minimo',
    question: '¿Hay un pedido mínimo?',
    answer:
      'El pedido mínimo mayorista es de $3,000 MXN. Los descuentos por volumen se aplican por pieza a partir de 6 unidades del mismo SKU y escalan por caja.',
  },
  {
    id: 'faq-credito',
    question: '¿Manejan crédito?',
    answer:
      'Sí. Después de tres pedidos liquidados en tiempo puedes solicitar línea de crédito a 30 días, sujeta a revisión de tu historial y referencias comerciales.',
  },
  {
    id: 'faq-envio',
    question: '¿Cuánto tarda el envío?',
    answer:
      'Los pedidos confirmados antes de las 14:00 salen el mismo día. Zona metropolitana con ruta propia en 24 horas; el resto del país entre 2 y 4 días hábiles por paquetería.',
  },
  {
    id: 'faq-devolucion',
    question: '¿Aceptan devoluciones?',
    answer:
      'Aceptamos devolución de producto sellado dentro de los 15 días naturales posteriores a la entrega. El producto con defecto de fábrica se reemplaza sin costo en cualquier momento de su garantía.',
  },
  {
    id: 'faq-capacitacion',
    question: '¿Ofrecen capacitación técnica?',
    answer:
      'Sí. Cada marca en exclusiva incluye capacitación de producto sin costo para clientes activos, presencial en sucursal o en línea.',
  },
];

export const certifications = [
  'COFEPRIS · Aviso de funcionamiento',
  'Distribuidor autorizado',
  'Factura electrónica CFDI 4.0',
  'Garantía de originalidad',
] as const;

export const paymentMethods = [
  'Visa',
  'Mastercard',
  'American Express',
  'Transferencia SPEI',
  'Crédito 30 días',
  'Efectivo en sucursal',
] as const;
