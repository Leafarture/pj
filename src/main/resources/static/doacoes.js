class DoacoesApp {
    constructor() {
        this.currentUser = null;
        this.donations = [];
        this.filteredDonations = [];
        this.init();
    }

    async init() {
        await this.checkAuth();
        this.setupEventListeners();
        await this.loadDonations();
    }

    async checkAuth() {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('/api/user/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    this.currentUser = await response.json();
                    this.showUserInfo();
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error);
                localStorage.removeItem('token');
            }
        }
        this.updateAuthUI();
    }

    showUserInfo() {
        const userInfo = document.getElementById('user-info');
        const userName = document.getElementById('user-name');
        const loginPrompt = document.getElementById('login-prompt');
        
        if (this.currentUser) {
            userName.textContent = `Olá, ${this.currentUser.nome}`;
            userInfo.style.display = 'flex';
            loginPrompt.style.display = 'none';
        } else {
            userInfo.style.display = 'none';
            loginPrompt.style.display = 'block';
        }
    }

    updateAuthUI() {
        const addDonationBtn = document.querySelector('.btn-add-donation');
        if (addDonationBtn) {
            if (this.currentUser) {
                addDonationBtn.style.display = 'flex';
            } else {
                addDonationBtn.style.display = 'none';
            }
        }
    }

    setupEventListeners() {
        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                this.currentUser = null;
                this.updateAuthUI();
                this.showUserInfo();
            });
        }

        // Filtros
        const filterBtn = document.getElementById('filter-btn');
        const clearBtn = document.getElementById('clear-filters');
        const cityInput = document.getElementById('filter-city');
        const typeInput = document.getElementById('filter-type');

        if (filterBtn) {
            filterBtn.addEventListener('click', () => this.applyFilters());
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFilters());
        }

        // Enter nos inputs de filtro
        [cityInput, typeInput].forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.applyFilters();
                    }
                });
            }
        });
    }

    async loadDonations() {
        const loading = document.getElementById('loading');
        const container = document.getElementById('doacoes-container');
        const noDonations = document.getElementById('no-donations');

        loading.style.display = 'block';
        container.innerHTML = '';
        noDonations.style.display = 'none';

        try {
            const response = await fetch('/doacoes');
            if (response.ok) {
                this.donations = await response.json();
                this.filteredDonations = [...this.donations];
                this.renderDonations();
            } else {
                throw new Error('Erro ao carregar doações');
            }
        } catch (error) {
            console.error('Erro:', error);
            this.showError('Erro ao carregar doações. Tente novamente.');
        } finally {
            loading.style.display = 'none';
        }
    }

    applyFilters() {
        const cityFilter = document.getElementById('filter-city').value.toLowerCase().trim();
        const typeFilter = document.getElementById('filter-type').value.toLowerCase().trim();

        this.filteredDonations = this.donations.filter(donation => {
            const cityMatch = !cityFilter || (donation.cidade && donation.cidade.toLowerCase().includes(cityFilter));
            const typeMatch = !typeFilter || (donation.tipoAlimento && donation.tipoAlimento.toLowerCase().includes(typeFilter));
            return cityMatch && typeMatch;
        });

        this.renderDonations();
    }

    clearFilters() {
        document.getElementById('filter-city').value = '';
        document.getElementById('filter-type').value = '';
        this.filteredDonations = [...this.donations];
        this.renderDonations();
    }

    renderDonations() {
        const container = document.getElementById('doacoes-container');
        const noDonations = document.getElementById('no-donations');

        container.innerHTML = '';

        if (this.filteredDonations.length === 0) {
            noDonations.style.display = 'block';
            return;
        }

        noDonations.style.display = 'none';

        this.filteredDonations.forEach(donation => {
            const card = this.createDonationCard(donation);
            container.appendChild(card);
        });
    }

    createDonationCard(donation) {
        const card = document.createElement('div');
        card.className = 'donation-card';

        const formattedDate = new Date(donation.criadoEm).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const donorName = donation.doador ? donation.doador.nome : 'Anônimo';
        const donorType = donation.doador ? donation.doador.tipoUsuario : 'INDIVIDUAL';

        card.innerHTML = `
            <div class="donation-header">
                <h3 class="donation-title">${donation.titulo || 'Sem título'}</h3>
                ${donation.tipoAlimento ? `<span class="donation-type">${donation.tipoAlimento}</span>` : ''}
            </div>
            
            ${donation.descricao ? `<p class="donation-description">${donation.descricao}</p>` : ''}
            
            <div class="donation-details">
                ${donation.cidade ? `
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${donation.cidade}</span>
                    </div>
                ` : ''}
                
                ${donation.quantidade ? `
                    <div class="detail-item">
                        <i class="fas fa-weight-hanging"></i>
                        <span>${donation.quantidade} kg</span>
                    </div>
                ` : ''}
                
                ${donation.endereco ? `
                    <div class="detail-item">
                        <i class="fas fa-home"></i>
                        <span>${donation.endereco}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="donation-footer">
                <div class="donor-info">
                    <i class="fas fa-user"></i>
                    <span>${donorName}</span>
                </div>
                <div class="donation-date">
                    <i class="fas fa-clock"></i>
                    ${formattedDate}
                </div>
            </div>
        `;

        return card;
    }

    showError(message) {
        const container = document.getElementById('doacoes-container');
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new DoacoesApp();
});