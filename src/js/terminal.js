const LINES = [
  { type: 'prompt', text: 'nicolas --status' },
  { type: 'output', text: 'disponível para novos projetos' },
  { type: 'prompt', text: 'nicolas --stack' },
  { type: 'output', text: 'html, css, js, unity, sheets' },
  { type: 'prompt', text: 'nicolas --resposta' },
  { type: 'output', text: 'geralmente no mesmo dia' },
];

const TYPE_SPEED = 38;
const LINE_PAUSE = 420;

export function initTerminal() {
  const body = document.getElementById('terminal-body');
  if (!body) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    LINES.forEach((line) => body.appendChild(renderStaticLine(line)));
    return;
  }

  runSequence(body, 0);
}

function renderStaticLine({ type, text }) {
  const el = document.createElement('div');
  el.className = 'terminal-line';
  if (type === 'prompt') {
    el.innerHTML = `<span class="terminal-prompt">nicolas@site:~$</span> ${text}`;
  } else {
    el.innerHTML = `<span class="terminal-output">${text}</span>`;
  }
  return el;
}

function runSequence(body, index) {
  if (index >= LINES.length) return;
  const line = LINES[index];
  const el = document.createElement('div');
  el.className = 'terminal-line';
  body.appendChild(el);

  if (line.type === 'output') {
    el.innerHTML = `<span class="terminal-output">${line.text}</span>`;
    setTimeout(() => runSequence(body, index + 1), LINE_PAUSE);
    return;
  }

  const prefix = '<span class="terminal-prompt">nicolas@site:~$</span> ';
  let charIndex = 0;

  function typeChar() {
    el.innerHTML = `${prefix}${line.text.slice(0, charIndex)}<span class="terminal-cursor"></span>`;
    if (charIndex < line.text.length) {
      charIndex += 1;
      setTimeout(typeChar, TYPE_SPEED);
    } else {
      el.innerHTML = `${prefix}${line.text}`;
      setTimeout(() => runSequence(body, index + 1), LINE_PAUSE);
    }
  }

  typeChar();
}
