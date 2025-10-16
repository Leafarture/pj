document.addEventListener('DOMContentLoaded', () => {
  /**
   * Carrega os dados do usuário do localStorage e atualiza a interface.
   */
  function loadUserData() {
    let userName = 'Usuário';
    let userEmail = 'usuario@email.com';
    let joinDate = '01/01/2024';
    let totalDoacoes = '0';
    let familiasAjudadas = '0';
    let avaliacaoMedia = '0';
    let userAvatar = null;

    // Tentar carregar dados do sistema de autenticação primeiro
    if (window.authManager && window.authManager.isAuthenticated()) {
      const user = window.authManager.getCurrentUser();
      if (user) {
        userName = user.nome || user.name || user.userName || 'Usuário';
        userEmail = user.email || 'usuario@email.com';
        userAvatar = user.avatarUrl || user.avatarDataUrl;
      }
    } else {
      // Fallback: carregar do localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          userName = user.nome || user.name || user.userName || 'Usuário';
          userEmail = user.email || 'usuario@email.com';
          userAvatar = user.avatarUrl || user.avatarDataUrl;
        } catch (error) {
          console.error('Erro ao parsear dados do usuário:', error);
        }
      }
    }

    // Carregar dados específicos da página
    userName = localStorage.getItem('userName') || userName;
    userEmail = localStorage.getItem('userEmail') || userEmail;
    joinDate = localStorage.getItem('joinDate') || '01/01/2024';
    totalDoacoes = localStorage.getItem('totalDoacoes') || '0';
    familiasAjudadas = localStorage.getItem('familiasAjudadas') || '0';
    avaliacaoMedia = localStorage.getItem('avaliacaoMedia') || '0';
    userAvatar = localStorage.getItem('userAvatar') || userAvatar;

    // Atualizar interface
    document.getElementById('user-name').textContent = userName;
    document.getElementById('user-email').textContent = userEmail;
    document.getElementById('join-date').textContent = joinDate;
    document.getElementById('total-doacoes').textContent = totalDoacoes;
    document.getElementById('familias-ajudadas').textContent = familiasAjudadas;
    document.getElementById('avaliacao-media').textContent = avaliacaoMedia;

    // Atualizar avatar se disponível
    const avatarImg = document.querySelector('.user-avatar img');
    if (avatarImg && userAvatar) {
      avatarImg.src = userAvatar;
    }
  }

  /**
   * Limpa os dados do usuário do localStorage e redireciona para a home.
   */
  function logout() {
    const confirmed = confirm('Tem certeza que deseja sair?');
    if (!confirmed) return;

    // Usar o sistema de autenticação se disponível
    if (window.authManager) {
      window.authManager.logout();
    } else {
      // Fallback: limpar localStorage manualmente
      localStorage.clear();
      alert('Logout realizado com sucesso! Até logo.');
      window.location.href = 'index.html';
    }
  }

  /**
   * Inicializa os event listeners para os botões de logout.
   */
  function initLogoutButtons() {
    const logoutButtons = [
      document.getElementById('logout-btn'),
      document.getElementById('mobile-logout-btn'),
      document.getElementById('profile-logout-btn'),
    ];

    logoutButtons.forEach((btn) => {
      if (btn) {
        btn.addEventListener('click', logout);
      }
    });
  }

  /**
   * Controla o menu mobile (hamburger).
   */
  function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a, button').forEach((element) => {
      element.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * Inicializa as ações rápidas com alertas informativos.
   */
  function initQuickActions() {
    document.querySelectorAll('.action-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action') || 'ação';
        alert(`Você clicou na ação: "${action}"`);
      });
    });
  }

  /**
   * Inicializa os botões "Detalhes" das doações agendadas.
   */
  function initScheduledDetails() {
    document.querySelectorAll('.btn-sm').forEach((btn) => {
      btn.addEventListener('click', () => {
        alert('Detalhes da doação abertos!');
      });
    });
  }

  // Escutar mudanças no estado de autenticação
  document.addEventListener('authStateChanged', () => {
    loadUserData();
  });

  // Execução inicial
  loadUserData();
  initLogoutButtons();
  initMobileMenu();
  initQuickActions();
  initScheduledDetails();
});