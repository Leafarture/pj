document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }

  // Remover a tela de loading com leve atraso
  setTimeout(() => {
    const loading = document.querySelector('.loading-screen');
    if (loading) {
      loading.style.opacity = '0';
      setTimeout(() => loading.remove(), 400);
    }
  }, 600);

  // Animação de entrada suave para seções marcadas com data-animate
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

  // Carregar dados do usuário
  try {
    const raw = localStorage.getItem('pj_user');
    if (raw) {
      const u = JSON.parse(raw);
      const nameEl = document.getElementById('pj-name');
      const emailEl = document.getElementById('pj-email');
      const avEl = document.getElementById('pj-avatar');
      if (nameEl && u.name) nameEl.textContent = u.name;
      if (emailEl && u.email) emailEl.textContent = u.email;
      if (avEl && u.avatarDataUrl) {
        avEl.textContent = '';
        avEl.style.background = `center/cover no-repeat url('${u.avatarDataUrl}')`;
      }
      const donationsEl = document.getElementById('pj-donations');
      if (donationsEl && Array.isArray(u.donations) && u.donations.length) {
        donationsEl.innerHTML = '';
        u.donations.forEach(d => {
          const li = document.createElement('li');
          li.style.background = '#fff';
          li.style.borderRadius = '12px';
          li.style.padding = '12px 16px';
          li.style.boxShadow = 'var(--shadow-md)';
          li.textContent = `${d.descricao || 'Doação'} • ${d.quantidade || ''} ${d.unidade || ''}`.trim();
          donationsEl.appendChild(li);
        });
      }
    }
  } catch (e) {
    console.warn('Não foi possível carregar dados do usuário:', e);
  }

  // Upload de avatar (salva dataURL no localStorage)
  const input = document.getElementById('pj-avatar-input');
  if (input) {
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const raw = localStorage.getItem('pj_user');
          const data = raw ? JSON.parse(raw) : {};
          data.avatarDataUrl = reader.result;
          localStorage.setItem('pj_user', JSON.stringify(data));
          const avEl = document.getElementById('pj-avatar');
          if (avEl) {
            avEl.textContent = '';
            avEl.style.background = `center/cover no-repeat url('${reader.result}')`;
          }
        } catch (e) {
          console.warn('Falha ao salvar avatar:', e);
        }
      };
      reader.readAsDataURL(file);
    });
  }
});
<script>
    // Funções JavaScript para interatividade básica
    function openDonationForm() {
        document.getElementById('donate').style.display = 'block';
        document.getElementById('home').style.display = 'none';
    }

    function closeDonationForm() {
        document.getElementById('donate').style.display = 'none';
        document.getElementById('home').style.display = 'grid';
    }

    function toggleProfile() {
        const profile = document.getElementById('profile');
        profile.style.display = profile.style.display === 'none' ? 'block' : 'none';
    }

    function editProfile() {
        // Simula edição (em um app real, tornaria os campos editáveis)
        alert('Função de edição ativada! (Implemente com backend para salvar mudanças)');
    }

    function toggleSection(sectionId) {
        const section = document.getElementById(sectionId);
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
        document.getElementById('home').style.display = 'none';
    }

    // Manipulação do formulário de doação
    document.getElementById('donationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Doação registrada com sucesso! (Em um app real, envie para o backend)');
        closeDonationForm();
    });

    // Navegação simples (mostra seções ao clicar nos links)
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (targetId === 'home') {
                document.getElementById('home').style.display = 'grid';
                // Esconde outras seções
                document.querySelectorAll('.profile-section').forEach(sec => sec.style.display = 'none');
            } else if (targetId === 'donate') {
                openDonationForm();
            } else if (targetId === 'profile') {
                document.getElementById('profile').style.display = 'block';
                document.getElementById('home').style.display = 'none';
            } else if (targetId === 'donations') {
                document.getElementById('donations').style.display = 'block';
                document.getElementById('home').style.display = 'none';
            } else if (targetId === 'history') {
                document.getElementById('history').style.display = 'block';
                document.getElementById('home').style.display = 'none';
            } else if (targetId === 'logout') {
                if (confirm('Deseja sair?')) {
                    window.location.href = 'login.html'; // Redireciona para login (crie o arquivo se necessário)
                }
            }
        });
    });
</script>
