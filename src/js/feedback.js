const MAX_CHARS = 1000;
let selectedRating = 0;
let selectedPhotoDataUrl = null;

export function initFeedbackForm() {
  const form = document.getElementById('feedback-form');
  if (!form) return;

  initStars();
  initCharCounter();
  initPhotoUpload();

  form.addEventListener('submit', handleSubmit);
}

/* ---------- estrelas ---------- */

function initStars() {
  const stars = Array.from(document.querySelectorAll('.star'));
  const group = document.getElementById('star-rating');

  const paint = (value) => {
    stars.forEach((star) => {
      const starValue = Number(star.dataset.value);
      star.classList.toggle('is-active', starValue <= value);
    });
  };

  stars.forEach((star) => {
    star.addEventListener('click', () => {
      selectedRating = Number(star.dataset.value);
      stars.forEach((s) => s.setAttribute('aria-checked', String(s === star)));
      paint(selectedRating);
      document.getElementById('rating-error').hidden = true;
    });

    star.addEventListener('mouseenter', () => paint(Number(star.dataset.value)));
  });

  if (group) {
    group.addEventListener('mouseleave', () => paint(selectedRating));
  }
}

/* ---------- contador de caracteres ---------- */

function initCharCounter() {
  const textarea = document.getElementById('feedback-text');
  const counter = document.getElementById('char-count');
  if (!textarea || !counter) return;

  textarea.addEventListener('input', () => {
    counter.textContent = String(textarea.value.length);
  });
}

/* ---------- upload de foto ---------- */

function initPhotoUpload() {
  const input = document.getElementById('feedback-photo');
  const preview = document.getElementById('photo-preview');
  const previewImg = document.getElementById('photo-preview-img');
  const removeBtn = document.getElementById('photo-remove');
  if (!input || !preview || !previewImg || !removeBtn) return;

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      selectedPhotoDataUrl = reader.result;
      previewImg.src = selectedPhotoDataUrl;
      preview.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  removeBtn.addEventListener('click', () => {
    input.value = '';
    selectedPhotoDataUrl = null;
    preview.hidden = true;
  });
}

/* ---------- envio ---------- */

function handleSubmit(event) {
  event.preventDefault();

  const ratingError = document.getElementById('rating-error');
  const status = document.getElementById('feedback-status');

  if (selectedRating === 0) {
    ratingError.hidden = false;
    status.textContent = '';
    document.getElementById('star-rating').scrollIntoView({ block: 'center', behavior: 'smooth' });
    return;
  }

  const name = document.getElementById('feedback-name').value.trim();
  const text = document.getElementById('feedback-text').value.trim().slice(0, MAX_CHARS);

  const entry = {
    name: name || 'Anônimo',
    rating: selectedRating,
    text,
    photo: selectedPhotoDataUrl,
    date: new Date(),
  };

  submitFeedback(entry)
    .then(() => {
      addEntryToList(entry);
      resetForm();
      status.classList.remove('is-error');
      status.textContent = 'Avaliação enviada. Obrigado por avaliar!';
    })
    .catch(() => {
      status.classList.add('is-error');
      status.textContent = 'Não deu pra enviar agora. Tenta de novo em instantes.';
    });
}

/**
 * Envia a avaliação.
 *
 * Hoje o site é 100% estático, então isso só resolve localmente (a
 * avaliação aparece na lista "desta sessão" logo abaixo do formulário).
 *
 * Pra receber avaliações de verdade, plugue um serviço tipo Formspree
 * ou EmailJS aqui — por exemplo:
 *
 *   return fetch('https://formspree.io/f/SEU_ID_AQUI', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(entry),
 *   });
 *
 * ou, com EmailJS:
 *
 *   return emailjs.send('SEU_SERVICE_ID', 'SEU_TEMPLATE_ID', entry, 'SUA_PUBLIC_KEY');
 */
function submitFeedback(entry) {
  return Promise.resolve(entry);
}

function addEntryToList(entry) {
  const list = document.getElementById('feedback-list');
  const empty = document.getElementById('feedback-empty');
  if (empty) empty.remove();

  const li = document.createElement('li');
  li.className = 'feedback-entry';

  const stars = '★'.repeat(entry.rating) + '☆'.repeat(5 - entry.rating);

  li.innerHTML = `
    <div class="feedback-entry-head">
      <span class="feedback-entry-name">${escapeHtml(entry.name)}</span>
      <span class="feedback-entry-stars" aria-label="${entry.rating} de 5 estrelas">${stars}</span>
    </div>
    ${entry.text ? `<p class="feedback-entry-text">${escapeHtml(entry.text)}</p>` : ''}
    ${entry.photo ? `<img class="feedback-entry-photo" src="${entry.photo}" alt="Foto enviada por ${escapeHtml(entry.name)}" />` : ''}
  `;

  list.prepend(li);
}

function resetForm() {
  const form = document.getElementById('feedback-form');
  form.reset();

  selectedRating = 0;
  selectedPhotoDataUrl = null;

  document.querySelectorAll('.star').forEach((star) => {
    star.classList.remove('is-active');
    star.setAttribute('aria-checked', 'false');
  });

  document.getElementById('char-count').textContent = '0';
  document.getElementById('photo-preview').hidden = true;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
