const PHONE = '5582999612513';

export function initWhatsappLinks() {
  const links = document.querySelectorAll('[data-service]');

  links.forEach((link) => {
    const service = link.dataset.service;
    const message = `Olá! Vi seu site e quero saber mais sobre o serviço de ${service}.`;
    link.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
  });
}
