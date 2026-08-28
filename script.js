const eventDate = new Date('2026-10-10T18:00:00+05:00').getTime();

function updateCountdown() {
  const distance = Math.max(0, eventDate - Date.now());
  const units = { days: 86400000, hours: 3600000, minutes: 60000, seconds: 1000 };
  let remainder = distance;
  Object.entries(units).forEach(([id, unit]) => {
    const value = Math.floor(remainder / unit);
    remainder %= unit;
    document.getElementById(id).textContent = String(value).padStart(2, '0');
  });
}

function setGuestGreeting() {
  const guest = new URLSearchParams(window.location.search).get('name');
  if (guest) document.getElementById('personalGreeting').textContent = `Дорогая ${guest}!`;
}

function setupRsvp() {
  const message = document.getElementById('rsvpMessage');
  const saved = localStorage.getItem('jubilee-rsvp');
  if (saved) message.textContent = saved === 'yes' ? 'Спасибо! Будем ждать Вас на празднике!' : 'Спасибо, что сообщили нам. Будем скучать!';
  document.querySelectorAll('[data-answer]').forEach((button) => {
    button.addEventListener('click', () => {
      const answer = button.dataset.answer;
      localStorage.setItem('jubilee-rsvp', answer);
      message.textContent = answer === 'yes' ? 'Спасибо! Будем ждать Вас на празднике!' : 'Спасибо, что сообщили нам. Будем скучать!';
    });
  });
}

function setupShare() {
  document.getElementById('shareButton').addEventListener('click', async () => {
    const shareData = { title: 'Юбилей мамы - 80 лет', text: 'Приглашаем Вас на 80-летний юбилей!', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(window.location.href); document.getElementById('rsvpMessage').textContent = 'Ссылка на приглашение скопирована.'; }
    } catch (_) { /* The guest closed the native share dialog. */ }
  });
}

function setupMusic() {
  const toggle = document.getElementById('musicToggle');
  const label = document.getElementById('musicLabel');
  const music = document.getElementById('backgroundMusic');
  music.volume = 0.24;
  toggle.addEventListener('click', async () => {
    if (!music.paused) {
      music.pause();
      toggle.classList.remove('is-playing'); toggle.setAttribute('aria-pressed', 'false'); label.textContent = 'Музыка';
      return;
    }
    try {
      await music.play();
      toggle.classList.add('is-playing'); toggle.setAttribute('aria-pressed', 'true'); label.textContent = 'Музыка вкл';
    } catch (_) {
      label.textContent = 'Нет сети';
    }
  });
}

updateCountdown(); setInterval(updateCountdown, 1000); setGuestGreeting(); setupRsvp(); setupShare(); setupMusic();
