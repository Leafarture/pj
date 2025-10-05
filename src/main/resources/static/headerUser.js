// Popula avatar/nome do usuário no header a partir do backend (se disponível) ou localStorage
(async function initHeaderUser(){
  try {
    let user = null;
    try {
      const res = await fetch('/auth/me', { credentials: 'include' });
      if (res.ok && (res.headers.get('Content-Type')||'').includes('application/json')) {
        user = await res.json();
      }
    } catch (e) {}
    if (!user) {
      const raw = localStorage.getItem('pj_user');
      if (raw) user = JSON.parse(raw);
    }
    if (!user) return;
    const container = document.querySelector('.header-actions');
    if (!container) return;
    let el = document.querySelector('.header-user');
    if (!el) {
      el = document.createElement('div');
      el.className = 'header-user';
      el.innerHTML = '<div class="header-user-avatar"><span>👤</span></div><span class="header-user-name"></span>';
      container.appendChild(el);
    }
    const nameEl = el.querySelector('.header-user-name');
    const avEl = el.querySelector('.header-user-avatar');
    if (nameEl && (user.name || user.nome || user.username)) nameEl.textContent = user.name || user.nome || user.username;
    const imgUrl = user.avatarDataUrl || user.avatarUrl || null;
    if (imgUrl) {
      avEl.innerHTML = '';
      const img = document.createElement('img');
      img.src = imgUrl;
      avEl.appendChild(img);
    }
  } catch (e) {
    // silencioso
  }
})();

