import type { QuoteLine } from '../context/quote-store';
import { socialLinks } from '../data/social-links';
import type { SocialLink } from '../types/social';

const whatsappBase =
  socialLinks.find((link) => link.id === 'whatsapp')?.href ?? 'https://wa.me/525543218800';

/** Every prefilled message opens the same way so the team knows the chat came from the site. */
const GREETING = 'Hola Buda Belleza, les escribo desde su tienda en línea.';

export function buildWhatsappHref(message: string) {
  return `${whatsappBase}?text=${encodeURIComponent(message)}`;
}

/** Prefilled messages, one per entry point, so each chat starts with its context. */
export const whatsappMessages = {
  general: `${GREETING} Me gustaría recibir información sobre sus productos, marcas y precios de mayoreo.`,
  advisor: `${GREETING} Quiero que un asesor me ayude a armar mi pedido mayorista y me comparta la lista de precios.`,
  contact: `${GREETING} Tengo una duda y me gustaría que me atiendan por este medio.`,
  validationAccount: `${GREETING} Todavía no tengo RFC y quiero saber cómo abrir una cuenta en validación para comprar al mayoreo.`,
  signup: `${GREETING} Acabo de enviar mi solicitud de alta mayorista y quiero adelantar el trámite por aquí.`,
} as const;

const categoryMessages: Record<string, string> = {
  tintes: `${GREETING} Me interesa la línea de Tintes y Color: quiero conocer las marcas, cartas de tonos, oxidantes y decolorantes que manejan, y sus precios de mayoreo.`,
  capilar: `${GREETING} Me interesa la línea de Tratamiento Capilar: quiero información sobre sus tratamientos, shampoos y productos de cabina, y sus precios de mayoreo.`,
  barberia: `${GREETING} Me interesa la línea de Barbería: quiero información sobre máquinas, navajas y productos de afeitado, y sus precios de mayoreo.`,
  unas: `${GREETING} Me interesa la línea de Uñas: quiero información sobre geles, acrílicos, esmaltes y herramientas, y sus precios de mayoreo.`,
  accesorios: `${GREETING} Me interesa la línea de Accesorios y Mobiliario: quiero información sobre el equipo y mobiliario para mi negocio, existencias y costo de flete.`,
  cosmeticos: `${GREETING} Me interesa la línea de Cosméticos: quiero conocer las marcas que manejan y sus precios de mayoreo.`,
};

/** WhatsApp opens with the general prefilled message; the other networks open their profile. */
export function socialLinkHref(link: SocialLink) {
  return link.id === 'whatsapp' ? buildWhatsappHref(whatsappMessages.general) : link.href;
}

export function categoryWhatsappMessage(category: { slug: string; name: string }) {
  return (
    categoryMessages[category.slug] ??
    `${GREETING} Me interesa la línea de ${category.name}: quiero información sobre sus productos y precios de mayoreo.`
  );
}

export function cartWhatsappMessage(lines: QuoteLine[]) {
  return [
    `${GREETING} Este es el pedido que armé en mi carrito; me gustaría confirmar precios, existencias y envío:`,
    '',
    ...lines.map((line) => `• ${line.product.sku} × ${line.quantity} pzas — ${line.product.name}`),
  ].join('\n');
}
