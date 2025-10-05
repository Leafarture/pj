document.addEventListener('DOMContentLoaded', () => {
  /**
   * Carrega os dados do usuário do localStorage e atualiza a interface.
   */
  function loadUser Data() {
    const userName = localStorage.getItem('userName') || 'Usuário';
    const userEmail = localStorage.getItem('userEmail') || 'usuario@email.com';
    const joinDate = localStorage.getItem('joinDate') || '01/01/2024';
    const totalDoacoes = localStorage.getItem('totalDoacoes') || '0';
    const familiasAjudadas = localStorage.getItem('familiasAjudadas') || '0';
    const avaliacaoMedia = localStorage.getItem('avaliacaoMedia') || '0';

    document.getElementById('user-name').textContent = userName;
    document.getElementById('user-email').textContent = userEmail;
    document.getElementById('join-date').textContent = joinDate;
    document.getElementById('total-doacoes').textContent = totalDoacoes;
    document.getElementById('familias-ajudadas').textContent = familiasAjudadas;
    document.getElementById('avaliacao-media').textContent = avaliacaoMedia;
  }

  /**
   * Limpa os dados do usuário do localStorage e redireciona para a home.
   */
  function logout() {
    const confirmed = confirm('Tem certeza que deseja sair?');
    if (!confirmed) return;

    localStorage.clear();
    alert('Logout realizado com sucesso! Até logo.');
    window.location.href = 'index.html';
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

  // Execução inicial
  loadUser Data();
  initLogoutButtons();
  initMobileMenu();
  initQuickActions();
  initScheduledDetails();
});