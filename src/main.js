import './style.css';

import { initNavigation } from './js/navigation.js';
import { initScrollReveal } from './js/scrollAnimations.js';
import { initServiceAccordions } from './js/services.js';
import { initFeedbackForm } from './js/feedback.js';
import { initWhatsappLinks } from './js/whatsapp.js';
import { initTerminal } from './js/terminal.js';

function init() {
  initNavigation();
  initScrollReveal();
  initServiceAccordions();
  initFeedbackForm();
  initWhatsappLinks();
  initTerminal();

  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
