export function initServiceAccordions() {
  const toggles = document.querySelectorAll('.service-toggle');

  toggles.forEach((button) => {
    const targetId = button.getAttribute('aria-controls');
    const details = document.getElementById(targetId);
    if (!details) return;

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      button.setAttribute('aria-expanded', String(!isOpen));
      details.hidden = isOpen;
      button.textContent = isOpen ? 'O que preciso saber' : 'Fechar detalhes';
    });
  });
}
