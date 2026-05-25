import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Inicio', href: getPermalink('/') },
    {
      text: 'Servicios',
      links: [
        { text: 'Aplicaciones con IA', href: getPermalink('/aplicaciones-ia') },
        { text: 'Desarrollo Web', href: getPermalink('/services') },
        { text: 'Apps Móviles', href: getPermalink('/homes/mobile-app') },
        { text: 'Automatizaciones', href: getPermalink('/automatizaciones') },
        { text: 'Landing Pages', href: getPermalink('/landing/lead-generation') },
        { text: 'UX/UI y Producto', href: getPermalink('/about#uiux-producto') },
      ],
    },
    { text: 'Startups', href: getPermalink('/homes/startup') },
    { text: 'Precios', href: getPermalink('/pricing') },
    { text: 'Contacto', href: getPermalink('/contact') },
  ],
  actions: [{ text: 'Solicitar propuesta', href: getPermalink('/contact') }],
};

export const footerData = {
  links: [
    {
      title: 'Servicios',
      links: [
        { text: 'Desarrollo Web', href: getPermalink('/services') },
        { text: 'Aplicaciones Móviles', href: getPermalink('/homes/mobile-app') },
        { text: 'Automatizaciones', href: getPermalink('/automatizaciones') },
        { text: 'Landing Pages', href: getPermalink('/landing/lead-generation') },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { text: 'Nosotros', href: getPermalink('/about') },
        { text: 'Precios', href: getPermalink('/pricing') },
        { text: 'Contacto', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Legal',
      links: [
        { text: 'Términos', href: getPermalink('/terms') },
        { text: 'Privacidad', href: getPermalink('/privacy') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Términos', href: getPermalink('/terms') },
    { text: 'Política de Privacidad', href: getPermalink('/privacy') },
  ],
  socialLinks: [],
  footNote: `Fade Technologies · Desarrollo web y apps móviles.`,
};
