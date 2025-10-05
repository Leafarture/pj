let currentPhoto = null;

document.addEventListener('DOMContentLoaded', () => {
  // Carregar nome/email/ foto do localStorage
  try {
    const raw = localStorage.getItem('pj_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u.name) document.getElementById('nome').value = u.name;
      if (u.email) document.getElementById('emailPerfil').value = u.email;
      if (u.avatarDataUrl) {
        const img = document.getElementById('avatarImg');
        img.src = u.avatarDataUrl;
        img.style.display = 'block';
        document.getElementById('avatarPlaceholder').style.display = 'none';
      }
    }
  } catch (e) {
    console.warn('Falha ao carregar dados do usuário:', e);
  }

  // Upload de foto
  const input = document.getElementById('avatarInput');
  const saveBtn = document.getElementById('savePhotoBtn');
  if (input) {
    input.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        currentPhoto = reader.result;
        document.getElementById('avatarImg').src = reader.result;
        document.getElementById('avatarImg').style.display = 'block';
        document.getElementById('avatarPlaceholder').style.display = 'none';
        saveBtn.style.display = 'inline-flex';
      };
      reader.readAsDataURL(file);
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (currentPhoto) {
        try {
          const raw = localStorage.getItem('pj_user');
          const data = raw ? JSON.parse(raw) : {};
          data.avatarDataUrl = currentPhoto;
          localStorage.setItem('pj_user', JSON.stringify(data));
          alert('Foto salva! (Em app real, envie para backend)');
          saveBtn.style.display = 'none';
        } catch (e) {
          console.warn('Falha ao salvar foto:', e);
        }
      }
    });
  }

  // Salvar nome
  const saveNameBtn = document.getElementById('saveNameBtn');
  if (saveNameBtn) {
    saveNameBtn.addEventListener('click', updateName);
  }

  // Preferências
  try {
    const raw = localStorage.getItem('pj_prefs');
    const p = raw ? JSON.parse(raw) : {};
    const setChecked = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };
    const setValue = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.value = val; };
    setChecked('notifEmail', p.notifEmail);
    setChecked('notifPush', p.notifPush);
    setChecked('themeToggle', p.themeDark);
    setValue('lang', p.lang || 'pt-BR');
    setValue('addrRua', p.addrRua || '');
    setValue('addrNumero', p.addrNumero || '');
    setValue('addrCidade', p.addrCidade || '');
    setValue('addrEstado', p.addrEstado || '');
    setValue('addrCep', p.addrCep || '');
  } catch {}
  const savePrefsBtn = document.getElementById('savePrefsBtn');
  if (savePrefsBtn) {
    savePrefsBtn.addEventListener('click', () => {
      const prefs = {
        notifEmail: document.getElementById('notifEmail').checked,
        notifPush: document.getElementById('notifPush').checked,
        themeDark: document.getElementById('themeToggle').checked,
        lang: document.getElementById('lang').value,
        addrRua: document.getElementById('addrRua').value.trim(),
        addrNumero: document.getElementById('addrNumero').value.trim(),
        addrCidade: document.getElementById('addrCidade').value.trim(),
        addrEstado: document.getElementById('addrEstado').value.trim(),
        addrCep: document.getElementById('addrCep').value.trim()
      };
      localStorage.setItem('pj_prefs', JSON.stringify(prefs));
      alert('Preferências salvas!');
      // Aplica tema escuro simples
      if (prefs.themeDark) {
        document.documentElement.style.backgroundColor = '#0b1220';
      } else {
        document.documentElement.style.backgroundColor = '';
      }
    });
  }

  const saveAddressBtn = document.getElementById('saveAddressBtn');
  if (saveAddressBtn) {
    saveAddressBtn.addEventListener('click', () => {
      // endereços já fazem parte das preferências; aqui só feedback
      alert('Endereço salvo!');
    });
  }

  // Trocar senha (apenas UI)
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const passwordForm = document.getElementById('passwordForm');
  const changePasswordBtn = document.getElementById('changePasswordBtn');
  if (togglePasswordBtn && passwordForm) {
    togglePasswordBtn.addEventListener('click', togglePasswordForm);
  }
  if (changePasswordBtn && passwordForm) {
    changePasswordBtn.addEventListener('click', changePassword);
  }

  // Estatísticas básicas a partir de localStorage
  try {
    const raw = localStorage.getItem('pj_user');
    const u = raw ? JSON.parse(raw) : null;
    const donations = (u && Array.isArray(u.donations)) ? u.donations : [];
    const total = donations.length;
    const pending = donations.filter(d => (d.status || '').toLowerCase() !== 'entregue').length;
    const delivered = donations.filter(d => (d.status || '').toLowerCase() === 'entregue').length;
    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = String(val); };
    setText('statDonations', total);
    setText('statPending', pending);
    setText('statDelivered', delivered);
  } catch {}

  // Logout simples (limpa localStorage e volta para home)
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
      } catch {}
      localStorage.removeItem('pj_user');
      window.location.href = 'home.html';
    });
  }

  // Excluir conta (somente UI; pronto para integrar com backend)
  const deleteBtn = document.getElementById('deleteAccountBtn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      const ok = confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.');
      if (!ok) return;
      try {
        await fetch('/auth/delete', { method: 'DELETE', credentials: 'include' });
      } catch {}
      localStorage.clear();
      window.location.href = 'home.html';
    });
  }
});

// Funções expostas (solicitadas)
function updateName() {
  const nome = document.getElementById('nome').value.trim();
  if (!nome) return;
  try {
    const raw = localStorage.getItem('pj_user');
    const data = raw ? JSON.parse(raw) : {};
    data.name = nome;
    data.email = document.getElementById('emailPerfil').value.trim();
    localStorage.setItem('pj_user', JSON.stringify(data));
    const status = document.getElementById('nameStatus');
    status.style.display = 'block';
    setTimeout(() => status.style.display = 'none', 3000);
    alert('Nome atualizado! (Em app real, envie para backend)');
  } catch (e) {
    console.warn('Falha ao salvar nome:', e);
  }
}

function togglePasswordForm() {
  const form = document.getElementById('passwordForm');
  form.classList.toggle('active');
}

function changePassword(event) {
  event.preventDefault();
  const senhaAtual = document.getElementById('senhaAtual').value;
  const nova = document.getElementById('novaSenha').value;
  const confirma = document.getElementById('confirmNovaSenha').value;
  if (!nova || nova.length < 8) {
    alert('Nova senha deve ter pelo menos 8 caracteres');
    return;
  }
  if (nova !== confirma) {
    alert('As senhas não coincidem');
    return;
  }
  alert('Senha alterada! (Em app real, envie para backend)');
  const form = document.getElementById('passwordForm');
  form.classList.remove('active');
  document.getElementById('senhaAtual').value = '';
  document.getElementById('novaSenha').value = '';
  document.getElementById('confirmNovaSenha').value = '';
}



