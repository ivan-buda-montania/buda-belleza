import { CreditCard, Headset, Store, Truck } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ValuePropCard } from './ValuePropCard';

const valueProps = [
  {
    icon: Truck,
    title: 'Envíos a todo México',
    description:
      'Tu pedido sale el mismo día si lo confirmas antes de las 14:00. Te mandamos guía y seguimiento por WhatsApp hasta que firmes de recibido.',
  },
  {
    icon: Headset,
    title: 'Un asesor comercial asignado',
    description:
      'La misma persona conoce tu carta de color, arma tu lista de reposición y te avisa cuando algo va a faltar. Sin conmutador.',
  },
  {
    icon: CreditCard,
    title: 'Crédito a 30 días y CFDI 4.0',
    description:
      'Línea de crédito a 30 días a partir del cuarto pedido, con factura 4.0 y complemento de pago emitidos el mismo día que compras.',
  },
  {
    icon: Store,
    title: 'Recolección el mismo día',
    description:
      'Aparta en línea y recoge en el mostrador mayorista de CDMX, Guadalajara o Monterrey, sin costo de envío ni monto mínimo.',
  },
];

export function ValuePropositionGrid() {
  return (
    <Section tone="surface" padding="lg" aria-labelledby="ventajas-title">
      <SectionHeading
        id="ventajas-title"
        eyebrow="Por qué Buda Belleza"
        title="Un proveedor que sostiene tu operación"
        description="Abastecemos a más de 3,200 salones, barberías y estudios que no pueden darse el lujo de cancelar un servicio por falta de producto."
      />

      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {valueProps.map((prop, index) => (
          <ValuePropCard key={prop.title} index={index + 1} {...prop} />
        ))}
      </ul>
    </Section>
  );
}
