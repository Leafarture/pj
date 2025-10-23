/**
 * Sistema de Perfil do Usuário - Prato Justo
 * Gerencia a exibição e edição do perfil do usuário
 */
class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.userStats = {
            totalDonations: 0,
            averageRating: 0,
            daysActive: 0
        };
        this.userDonations = [];
        this.userRatings = [];
        this.init();
    }

    async init() {
        console.log('=== DEBUG init ===');
        console.log('ProfileManager inicializando...');
        
        // Verificar se o usuário está logado antes de carregar dados
        if (!this.isUserAuthenticated()) {
            console.log('Usuário não autenticado, redirecionando...');
            this.redirectToLogin();
            return;
        }

        console.log('Usuário autenticado, carregando dados...');
        await this.loadUserData();
        this.setupEventListeners();
        this.loadUserDonations();
        this.loadUserRatings();
        this.calculateUserStats();
    }

    /**
     * Verifica se o usuário está autenticado
     */
    isUserAuthenticated() {
        return window.authManager && window.authManager.isAuthenticated();
    }

    /**
     * Redireciona para a tela de cadastro se não estiver logado
     */
    redirectToLogin() {
        window.location.href = 'cadastro_perfil.html';
    }

    /**
     * Carrega os dados do usuário do sistema de autenticação
     */
    async loadUserData() {
        console.log('=== DEBUG loadUserData ===');
        console.log('authManager existe:', !!window.authManager);
        console.log('authManager autenticado:', window.authManager ? window.authManager.isAuthenticated() : false);
        console.log('getCurrentUser:', window.authManager ? window.authManager.getCurrentUser() : null);
        
        // Pegar dados do usuário logado diretamente do authManager
        if (window.authManager && window.authManager.getCurrentUser()) {
            this.currentUser = window.authManager.getCurrentUser();
            console.log('Dados do usuário carregados:', this.currentUser);
            this.updateProfileDisplay();
        } else {
            console.log('Usando dados padrão');
            // Se não tiver dados, usar dados padrão
            this.setDefaultUser();
        }
    }

    /**
     * Carrega dados de fallback do localStorage
     */
    loadFallbackData() {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
                this.currentUser = JSON.parse(storedUser);
                this.updateProfileDisplay();
        } catch (error) {
          console.error('Erro ao parsear dados do usuário:', error);
                this.setDefaultUser();
            }
        } else {
            this.setDefaultUser();
        }
    }

    /**
     * Define dados padrão do usuário
     */
    setDefaultUser() {
        this.currentUser = {
            id: null,
            nome: 'Usuário',
            email: 'usuario@email.com',
            telefone: null,
            tipoUsuario: 'INDIVIDUAL',
            dataCadastro: new Date().toISOString(),
            statusAtivo: true,
            verificado: false
        };
        this.updateProfileDisplay();
    }

    /**
     * Atualiza a exibição do perfil na interface
     */
    updateProfileDisplay() {
        console.log('=== DEBUG updateProfileDisplay ===');
        console.log('currentUser:', this.currentUser);
        
        if (!this.currentUser) {
            console.log('currentUser é null, retornando');
            return;
        }

        // Informações básicas
        const userNameElement = document.getElementById('profile-user-name');
        console.log('Elemento profile-user-name encontrado:', !!userNameElement);
        console.log('Nome a ser definido:', this.currentUser.nome || 'Usuário');
        
        if (userNameElement) {
            userNameElement.textContent = this.currentUser.nome || 'Usuário';
            console.log('Nome definido com sucesso!');
        } else {
            console.error('Elemento profile-user-name NÃO encontrado!');
            // Tentar novamente após um delay
            setTimeout(() => {
                const retryElement = document.getElementById('profile-user-name');
                if (retryElement) {
                    retryElement.textContent = this.currentUser.nome || 'Usuário';
                    console.log('Nome definido na segunda tentativa!');
                }
            }, 100);
        }
        document.getElementById('user-type-text').textContent = this.getUserTypeLabel(this.currentUser.tipoUsuario);
        
        // Avatar
        const avatarImg = document.getElementById('user-avatar');
        const avatarPlaceholder = document.getElementById('user-avatar-placeholder');
        
        if (this.currentUser.avatarUrl) {
            avatarImg.src = this.currentUser.avatarUrl;
            avatarImg.style.display = 'block';
            avatarPlaceholder.style.display = 'none';
        } else {
            avatarImg.style.display = 'none';
            avatarPlaceholder.style.display = 'flex';
        }

        // Badge de verificação
        const verificationBadge = document.getElementById('verification-badge');
        if (this.currentUser.verificado) {
            verificationBadge.style.display = 'flex';
        }

        // Contatos
        document.getElementById('contact-email').textContent = this.currentUser.email || 'Não informado';
        document.getElementById('contact-phone').textContent = this.currentUser.telefone || 'Não informado';
        
        // Data de cadastro
        const joinDate = this.currentUser.dataCadastro ? 
            new Date(this.currentUser.dataCadastro).toLocaleDateString('pt-BR') : 'Não informado';
        document.getElementById('member-since').textContent = joinDate;

        // Endereço (simulado - não está no modelo atual)
        document.getElementById('address-text').textContent = 'Não informado';
        document.getElementById('city-text').textContent = 'Não informado';
        document.getElementById('location-text').textContent = 'Não informado';

        // Descrição (simulada)
        document.getElementById('description-text').textContent = 'Não informado';

        // Calcular dias ativo
        if (this.currentUser.dataCadastro) {
            const joinDate = new Date(this.currentUser.dataCadastro);
            const today = new Date();
            const diffTime = Math.abs(today - joinDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            document.getElementById('days-active').textContent = diffDays;
    }
  }

  /**
     * Converte tipo de usuário para label amigável
     */
    getUserTypeLabel(tipoUsuario) {
        const labels = {
            'INDIVIDUAL': 'Pessoa Física',
            'ESTABELECIMENTO': 'Estabelecimento',
            'ONG': 'ONG',
            'RECEPTOR': 'Receptor'
        };
        return labels[tipoUsuario] || 'Usuário';
    }

    /**
     * Carrega as doações do usuário
     */
    async loadUserDonations() {
        try {
            if (window.authManager && window.authManager.isAuthenticated()) {
                const token = window.authManager.getToken();
                const response = await fetch('/doacoes/minhas', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    this.userDonations = await response.json();
                    this.displayUserDonations();
                } else {
                    console.error('Erro ao carregar doações:', response.statusText);
                    this.displayEmptyDonations();
                }
    } else {
                this.displayEmptyDonations();
            }
        } catch (error) {
            console.error('Erro ao carregar doações:', error);
            this.displayEmptyDonations();
    }
  }

  /**
     * Exibe as doações do usuário na interface
     */
    displayUserDonations() {
        const donationsList = document.getElementById('donations-list');
        
        if (this.userDonations.length === 0) {
            donationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <span>Nenhuma doação encontrada</span>
                </div>
            `;
            return;
        }

        const donationsHTML = this.userDonations.slice(0, 5).map(donation => `
            <div class="donation-item">
                <div class="donation-info">
                    <div class="donation-title">${donation.titulo || 'Doação'}</div>
                    <div class="donation-description">${donation.descricao || 'Sem descrição'}</div>
                    <div class="donation-date">${new Date(donation.criadoEm).toLocaleDateString('pt-BR')}</div>
                </div>
                <div class="donation-status status-${this.getDonationStatus(donation)}">
                    ${this.getDonationStatusLabel(donation)}
                </div>
            </div>
        `).join('');

        donationsList.innerHTML = donationsHTML;
    }

    /**
     * Exibe estado vazio para doações
     */
    displayEmptyDonations() {
        const donationsList = document.getElementById('donations-list');
        donationsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <span>Nenhuma doação encontrada</span>
            </div>
        `;
    }

    /**
     * Determina o status da doação
     */
    getDonationStatus(donation) {
        if (!donation.ativo) return 'cancelled';
        // Lógica simplificada - pode ser expandida
        return 'pending';
    }

    /**
     * Retorna label do status da doação
     */
    getDonationStatusLabel(donation) {
        const status = this.getDonationStatus(donation);
        const labels = {
            'delivered': 'Entregue',
            'pending': 'Pendente',
            'cancelled': 'Cancelada'
        };
        return labels[status] || 'Pendente';
    }

    /**
     * Carrega as avaliações do usuário
     */
    async loadUserRatings() {
        // Simulado - não há API específica para avaliações do usuário
        this.userRatings = [];
        this.displayUserRatings();
    }

    /**
     * Exibe as avaliações do usuário na interface
     */
    displayUserRatings() {
        const ratingsList = document.getElementById('ratings-list');
        
        if (this.userRatings.length === 0) {
            ratingsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-star"></i>
                    <span>Nenhuma avaliação encontrada</span>
                </div>
            `;
            return;
        }

        // Implementar exibição das avaliações quando houver dados
    }

    /**
     * Calcula estatísticas do usuário
     */
    calculateUserStats() {
        this.userStats.totalDonations = this.userDonations.length;
        this.userStats.averageRating = 4.5; // Simulado

        this.updateStatsDisplay();
    }

    /**
     * Atualiza a exibição das estatísticas
     */
    updateStatsDisplay() {
        document.getElementById('total-donations').textContent = this.userStats.totalDonations;
        document.getElementById('average-rating').textContent = this.userStats.averageRating.toFixed(1);

        // Estatísticas nos cards
        document.getElementById('total-donations-stat').textContent = this.userStats.totalDonations;
        document.getElementById('average-rating-stat').textContent = this.userStats.averageRating.toFixed(1);

        // Avaliações
        document.getElementById('rating-average').textContent = this.userStats.averageRating.toFixed(1);
        document.getElementById('rating-count').textContent = this.userRatings.length;

        // Atualizar estrelas
        this.updateStarsDisplay(this.userStats.averageRating);
    }

    /**
     * Atualiza a exibição das estrelas
     */
    updateStarsDisplay(rating) {
        const starsDisplay = document.getElementById('stars-display');
        const stars = starsDisplay.querySelectorAll('i');
        
        stars.forEach((star, index) => {
            if (index < Math.floor(rating)) {
                star.classList.add('fas');
                star.classList.remove('far');
            } else if (index < rating) {
                star.classList.add('fas', 'fa-star-half-alt');
                star.classList.remove('far');
            } else {
                star.classList.add('far');
                star.classList.remove('fas', 'fa-star-half-alt');
      }
    });
  }

  /**
     * Configura os event listeners
     */
    setupEventListeners() {
        // Botão de editar perfil
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => this.openEditModal());
        }

        // Botões de editar cards
        document.querySelectorAll('.btn-edit-card').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cardType = e.target.closest('.btn-edit-card').dataset.card;
                this.editCard(cardType);
            });
        });

        // Botões de ver todas
        document.querySelectorAll('.btn-view-all').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.btn-view-all').dataset.section;
                this.viewAll(section);
      });
    });

        // Modal de edição
        this.setupModalEvents();
    }

    /**
     * Configura eventos do modal
     */
    setupModalEvents() {
        const modal = document.getElementById('edit-profile-modal');
        const closeBtn = document.querySelector('.btn-close-modal');
        const cancelBtn = document.querySelector('.btn-cancel');
        const form = document.getElementById('edit-profile-form');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeEditModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeEditModal());
        }

        if (form) {
            form.addEventListener('submit', (e) => this.saveProfile(e));
        }

        // Fechar modal ao clicar no overlay
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeEditModal();
                }
            });
        }
    }

    /**
     * Abre o modal de edição
     */
    openEditModal() {
        const modal = document.getElementById('edit-profile-modal');
        if (modal) {
            this.populateEditForm();
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Fecha o modal de edição
     */
    closeEditModal() {
        const modal = document.getElementById('edit-profile-modal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    /**
     * Preenche o formulário de edição com dados atuais
     */
    populateEditForm() {
        if (!this.currentUser) return;

        document.getElementById('edit-name').value = this.currentUser.nome || '';
        document.getElementById('edit-email').value = this.currentUser.email || '';
        document.getElementById('edit-phone').value = this.currentUser.telefone || '';
        document.getElementById('edit-description').value = this.currentUser.descricao || '';
        document.getElementById('edit-address').value = this.currentUser.endereco || '';
        document.getElementById('edit-city').value = this.currentUser.cidade || '';
    }

    /**
     * Salva as alterações do perfil
     */
    async saveProfile(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const updatedData = {
            nome: formData.get('name'),
            email: formData.get('email'),
            telefone: formData.get('phone'),
            descricao: formData.get('description'),
            endereco: formData.get('address'),
            cidade: formData.get('city')
        };

        try {
            if (window.authManager && window.authManager.isAuthenticated()) {
                const token = window.authManager.getToken();
                const response = await fetch('/api/user/me', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });

                if (response.ok) {
                    // Atualizar dados locais
                    Object.assign(this.currentUser, updatedData);
                    this.updateProfileDisplay();
                    this.closeEditModal();
                    this.showNotification('Perfil atualizado com sucesso!', 'success');
                } else {
                    throw new Error('Erro ao atualizar perfil');
                }
            } else {
                // Fallback: salvar no localStorage
                Object.assign(this.currentUser, updatedData);
                localStorage.setItem('user', JSON.stringify(this.currentUser));
                this.updateProfileDisplay();
                this.closeEditModal();
                this.showNotification('Perfil atualizado com sucesso!', 'success');
            }
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            this.showNotification('Erro ao atualizar perfil', 'error');
        }
    }

    /**
     * Edita um card específico
     */
    editCard(cardType) {
        this.showNotification(`Editar ${cardType} - Funcionalidade em desenvolvimento`, 'info');
    }

    /**
     * Visualiza todas as seções
     */
    viewAll(section) {
        if (section === 'donations') {
            window.location.href = 'minhas-doacoes.html';
        } else if (section === 'ratings') {
            this.showNotification('Visualizar todas as avaliações - Funcionalidade em desenvolvimento', 'info');
        }
    }

    /**
     * Realiza logout
     */
    logout() {
        const confirmed = confirm('Tem certeza que deseja sair?');
        if (!confirmed) return;

        if (window.authManager) {
            window.authManager.logout();
            // Redirecionar para index após logout
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            localStorage.clear();
            window.location.href = 'index.html';
        }
    }

    /**
     * Exibe notificação
     */
    showNotification(message, type = 'info') {
        // Usar o sistema de notificação do authManager se disponível
        if (window.authManager && window.authManager.showNotification) {
            window.authManager.showNotification(message, type);
        } else {
            // Fallback: alert simples
            alert(message);
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
    
    // Força bruta - garantir que o nome seja atualizado
    setTimeout(() => {
        console.log('=== FORÇA BRUTA - Atualizando nome ===');
        const userNameElement = document.getElementById('profile-user-name');
        if (userNameElement && userNameElement.textContent === '') {
            if (window.authManager && window.authManager.getCurrentUser()) {
                const user = window.authManager.getCurrentUser();
                userNameElement.textContent = user.nome || 'Usuário';
                console.log('Nome atualizado via força bruta:', user.nome);
            }
        }
    }, 2000);
});