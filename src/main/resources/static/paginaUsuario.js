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
        await this.loadUserDonations();
        await this.loadUserRatings();
        await this.calculateUserStats();
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
        
        try {
            // Buscar dados ATUALIZADOS da API (incluindo campos de endereço)
            if (window.authManager && window.authManager.isAuthenticated()) {
                const token = window.authManager.getToken();
                console.log('Buscando dados atualizados da API...');
                
                const response = await fetch('/api/user/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    this.currentUser = await response.json();
                    console.log('✅ Dados do usuário carregados da API:', this.currentUser);
                    
                    // Atualizar também o localStorage para manter sincronizado
                    localStorage.setItem('user', JSON.stringify(this.currentUser));

                    // Notificar outras partes da UI (header) que o usuário foi atualizado
                    document.dispatchEvent(new CustomEvent('authStateChanged', {
                        detail: { isAuthenticated: true, user: this.currentUser }
                    }));

                    this.updateProfileDisplay();
                } else {
                    console.error('❌ Erro ao buscar dados da API:', response.status);
                    // Fallback para dados do localStorage se a API falhar
                    this.loadFromAuthManager();
                }
            } else {
                console.log('Não autenticado, usando dados padrão');
                this.setDefaultUser();
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados do usuário:', error);
            // Fallback para dados do localStorage se houver erro
            this.loadFromAuthManager();
        }
    }

    /**
     * Carrega dados do authManager como fallback
     */
    loadFromAuthManager() {
        console.log('📦 Usando dados do localStorage como fallback...');
        if (window.authManager && window.authManager.getCurrentUser()) {
            this.currentUser = window.authManager.getCurrentUser();
            console.log('Dados carregados do authManager (fallback):', this.currentUser);
            this.updateProfileDisplay();
        } else {
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
        const avatarContainer = avatarImg ? avatarImg.closest('.avatar-container') : null;
        
        if (this.currentUser.avatarUrl) {
            // Adicionar cache-busting para garantir que a imagem atualize
            const updatedAt = localStorage.getItem('avatarUpdatedAt');
            const urlWithVersion = this.currentUser.avatarUrl + (this.currentUser.avatarUrl.includes('?') ? '&' : '?') + 'v=' + (updatedAt || Date.now());
            avatarImg.src = urlWithVersion;
            avatarImg.style.display = 'block';
            avatarPlaceholder.style.display = 'none';
            if (avatarContainer) avatarContainer.classList.add('has-avatar');
        } else {
            avatarImg.style.display = 'none';
            avatarPlaceholder.style.display = 'flex';
            if (avatarContainer) avatarContainer.classList.remove('has-avatar');
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

        // Endereço
        const enderecoCompleto = this.currentUser.rua ? 
            `${this.currentUser.rua}${this.currentUser.numero ? ', ' + this.currentUser.numero : ''}${this.currentUser.complemento ? ' - ' + this.currentUser.complemento : ''}` : 
            'Não informado';
        document.getElementById('address-text').textContent = enderecoCompleto;
        document.getElementById('city-text').textContent = this.currentUser.cidade || 'Não informado';
        
        const localizacao = (this.currentUser.cidade && this.currentUser.estado) ? 
            `${this.currentUser.cidade} - ${this.currentUser.estado}` : 
            (this.currentUser.cidade || this.currentUser.estado || 'Não informado');
        document.getElementById('location-text').textContent = localizacao;

        // Descrição
        document.getElementById('description-text').textContent = this.currentUser.descricao || 'Não informado';

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
    async calculateUserStats() {
        // Usar dados reais da API
        try {
            if (window.authManager && window.authManager.isAuthenticated()) {
                const token = window.authManager.getToken();
                const response = await fetch('/api/user/me/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const stats = await response.json();
                    this.userStats.totalDonations = stats.totalDonations || 0;
                    this.userStats.averageRating = stats.averageRating || 0.0;
                } else {
                    // Fallback para dados locais
                    this.userStats.totalDonations = this.userDonations.length;
                    this.userStats.averageRating = 0.0;
                }
            } else {
                this.userStats.totalDonations = this.userDonations.length;
                this.userStats.averageRating = 0.0;
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            this.userStats.totalDonations = this.userDonations.length;
            this.userStats.averageRating = 0.0;
        }

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
        const overlay = document.getElementById('modal-overlay');
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
        if (overlay) {
            overlay.addEventListener('click', () => {
                    this.closeEditModal();
            });
        }

        // Upload de avatar
        this.setupAvatarUpload();
    }

    /**
     * Configura o sistema de upload de avatar
     */
    setupAvatarUpload() {
        const uploadBtn = document.querySelector('.btn-upload-avatar');
        const avatarInput = document.getElementById('avatar-upload');
        const avatarPreviewContainer = document.querySelector('.avatar-preview-container');

        if (uploadBtn && avatarInput) {
            // Ao clicar no botão, abrir o seletor de arquivos
            uploadBtn.addEventListener('click', () => {
                avatarInput.click();
            });

            // Ao clicar no container do avatar, abrir o seletor de arquivos
            if (avatarPreviewContainer) {
                avatarPreviewContainer.addEventListener('click', () => {
                    avatarInput.click();
                });
            }

            // Quando um arquivo é selecionado
            avatarInput.addEventListener('change', (e) => {
                this.handleAvatarUpload(e);
            });
        }
    }

    /**
     * Manipula o upload do avatar
     */
    handleAvatarUpload(event) {
        const file = event.target.files[0];
        
        if (!file) return;

        // Validar tipo de arquivo
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            this.showNotification('Por favor, selecione uma imagem válida (JPG, PNG ou GIF)', 'error');
            return;
        }

        // Validar tamanho (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB em bytes
        if (file.size > maxSize) {
            this.showNotification('A imagem deve ter no máximo 5MB', 'error');
            return;
        }

        // Preview da imagem
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('edit-avatar-preview');
            const placeholder = document.getElementById('edit-avatar-placeholder');
            
            if (preview && placeholder) {
                preview.src = e.target.result;
                preview.style.display = 'block';
                placeholder.style.display = 'none';

                const container = preview.closest('.avatar-preview-container');
                if (container) container.classList.add('has-avatar');
            }

            // Armazenar o arquivo para envio posterior
            this.pendingAvatarFile = file;
            this.pendingAvatarData = e.target.result;
        };

        reader.readAsDataURL(file);
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
        
        // Preencher endereço completo (rua)
        document.getElementById('edit-address').value = this.currentUser.rua || '';
        document.getElementById('edit-city').value = this.currentUser.cidade || '';

        // Avatar
        const preview = document.getElementById('edit-avatar-preview');
        const placeholder = document.getElementById('edit-avatar-placeholder');
        
        if (this.currentUser.avatarUrl && preview && placeholder) {
            preview.src = this.currentUser.avatarUrl;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        } else if (preview && placeholder) {
            preview.style.display = 'none';
            placeholder.style.display = 'flex';
        }

        // Limpar arquivo pendente
        this.pendingAvatarFile = null;
        this.pendingAvatarData = null;
    }

    /**
     * Salva as alterações do perfil
     */
    async saveProfile(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        
        // Validar campos obrigatórios
        const nome = formData.get('name');
        const email = formData.get('email');
        
        if (!nome || nome.trim() === '') {
            this.showNotification('O nome é obrigatório', 'error');
            return;
        }
        
        if (!email || email.trim() === '') {
            this.showNotification('O email é obrigatório', 'error');
            return;
        }
        
        const updatedData = {
            nome: nome.trim(),
            email: email.trim(),
            telefone: formData.get('phone') || null,
            descricao: formData.get('description') || null,
            rua: formData.get('address') || null,
            cidade: formData.get('city') || null
        };

        console.log('📤 Enviando dados:', updatedData);

        try {
            if (window.authManager && window.authManager.isAuthenticated()) {
                const token = window.authManager.getToken();
                
                // Se houver arquivo de avatar, fazer upload PRIMEIRO
                if (this.pendingAvatarFile) {
                    console.log('📸 Fazendo upload do avatar...');
                    await this.uploadAvatar(this.pendingAvatarFile, token);
                    // Marcar timestamp para cache-busting no header
                    localStorage.setItem('avatarUpdatedAt', Date.now().toString());
                }
                
                // Depois, atualizar dados do perfil
                const response = await fetch('/api/user/me', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Perfil atualizado:', data);

                    // Atualizar dados locais
                    Object.assign(this.currentUser, data);
                    
                    this.closeEditModal();
                    this.showNotification('Perfil atualizado com sucesso!', 'success');
                    
                    // Recarregar a página para refletir todas as mudanças
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    // Tentar obter mensagem de erro do servidor
                    const errorText = await response.text();
                    console.error('❌ Erro do servidor:', errorText);
                    throw new Error(errorText || 'Erro ao atualizar perfil');
                }
            } else {
                // Fallback: salvar no localStorage
                // NOTA: base64 é apenas para preview local, não salvamos no servidor
                if (this.pendingAvatarData) {
                    updatedData.avatarUrl = this.pendingAvatarData;
                }
                Object.assign(this.currentUser, updatedData);
                localStorage.setItem('user', JSON.stringify(this.currentUser));
                this.updateProfileDisplay();
                this.closeEditModal();
                this.showNotification('Perfil atualizado com sucesso!', 'success');
            }
        } catch (error) {
            console.error('❌ Erro ao salvar perfil:', error);
            this.showNotification('Erro ao atualizar perfil: ' + error.message, 'error');
        }
    }

    /**
     * Faz upload do avatar do usuário
     */
    async uploadAvatar(file, token) {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch('/api/user/me/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                // Atualizar avatar local imediatamente com a URL retornada
                const data = await response.json();
                if (data && data.avatarUrl) {
                    this.currentUser = this.currentUser || {};
                    this.currentUser.avatarUrl = data.avatarUrl;
                    
                    // Persistir no localStorage
                    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                    const mergedUser = { ...storedUser, ...this.currentUser, avatarUrl: data.avatarUrl };
                    localStorage.setItem('user', JSON.stringify(mergedUser));

                    // Avisar o header para atualizar a imagem (com cache-busting)
                    localStorage.setItem('avatarUpdatedAt', Date.now().toString());
                    document.dispatchEvent(new CustomEvent('authStateChanged', {
                        detail: { isAuthenticated: true, user: mergedUser }
                    }));

                    // Atualizar avatar na página de perfil, se visível
                    const avatarImg = document.getElementById('user-avatar');
                    const avatarPlaceholder = document.getElementById('user-avatar-placeholder');
                    if (avatarImg && avatarPlaceholder) {
                        const updatedAt = localStorage.getItem('avatarUpdatedAt');
                        const urlWithVersion = data.avatarUrl + (data.avatarUrl.includes('?') ? '&' : '?') + 'v=' + (updatedAt || Date.now());
                        avatarImg.src = urlWithVersion;
                        avatarImg.style.display = 'block';
                        avatarPlaceholder.style.display = 'none';
                        const avatarContainer = avatarImg.closest('.avatar-container');
                        if (avatarContainer) avatarContainer.classList.add('has-avatar');
                    }
                }
            } else {
                console.warn('Falha ao fazer upload do avatar, mas o perfil foi atualizado');
            }
        } catch (error) {
            console.error('Erro ao fazer upload do avatar:', error);
            // Não lançar erro para não afetar o resto da atualização
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