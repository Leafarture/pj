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
        alert('Função de edição ativada! (Implemente com backend para salvar mudanças corporativas)');
    }

    function toggleSection(sectionId) {
        const section = document.getElementById(sectionId);
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
        document.getElementById('home').style.display = 'none';
    }

    function generateReport() {
        const preview = document.getElementById('reportPreview');
        preview.style.display = 'block';
        alert('Relatório gerado! (Em um app real, baixe PDF via backend)');
    }

    // Manipulação do formulário de doação corporativa
    document.getElementById('corporateDonationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Doação corporativa registrada com sucesso! (Em um app real, envie para o backend e notifique logística)');
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
                document.querySelectorAll('.profile-section, .donation-form').forEach(sec => sec.style.display = 'none');
            } else if (targetId === 'donate') {
                openDonationForm();
            } else if (targetId === 'profile') {
                document.getElementById('profile').style.display = 'block';
                document.getElementById('home').style.display = 'none';
            } else if (targetId === 'donations') {
                document.getElementById('donations').style.display = 'block';
                document.getElementById('home').style.display = 'none';
            } else if (targetId === 'reports') {
                document.getElementById('reports').style.display = 'block';
                document.getElementById('home').style.display = 'none';
            } else if (targetId === 'logout') {
                if (confirm('Deseja sair?')) {
                    window.location.href = 'login-empresa.html'; // Redireciona para login de empresa
                }
            }
        });
    });
</script>