import prices from './fade-prices.json';

export const { items, combos } = prices;
export const phone = '833 345 7263';
export const phoneLink = 'tel:+528333457263';
export const facebook = 'https://www.facebook.com/fadetechmx';
export const hours = 'Lunes a viernes, 10:00 a 17:00';
export const cities = 'Tampico, Ciudad Madero y Altamira';
export const address = 'Integración Social 420, Tampico, Tamaulipas';
export const maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
export const whatsapp = (message = 'Hola, quiero información sobre los servicios de Fade Technologies.') =>
  'https://wa.me/528333457263?text=' + encodeURIComponent(message);
export const mxn = (value: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value);
export const priceOf = (id: string) => {
  const value = items.find((item) => item.id === id)?.amount;
  if (value === undefined || value === null) return 'Por cotización';
  return mxn(value);
};
