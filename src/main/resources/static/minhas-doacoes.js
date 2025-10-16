class MinhasDoacoesApp {
    constructor() {
        this.currentUser = null;
        this.myDonations = [];
        this.init();
    }

    async init() {
        await this.checkAuth();
        if (this.currentUser) {
            this.setupEventListeners();
            await this.loadMyDonations();
            this.calculateStats();
        }
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
                    this.showAuthenticatedContent();
                } else {
                    localStorage.removeItem('token');
                    this.showAuthRequired();
                }
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error);
                localStorage.removeItem('token');
                this.showAuthRequired();
            }
        } else {
            this.showAuthRequired();
        }
    }

    showAuthenticatedContent() {
        document.getElementById('auth-required').style.display = 'none';
        document.getElementById('authenticated-content').style.display = 'block';
        
        const userName = document.getElementById('user-name');
        userName.textContent = `Olá, ${this.currentUser.nome}`;
    }

    showAuthRequired() {
        document.getElementById('auth-required').style.display = 'block';
        document.getElementById('authenticated-content').style.display = 'none';
    }

    setupEventListeners() {
        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                this.currentUser = null;
                this.showAuthRequired();
            });
        }
    }

    async loadMyDonations() {
        const loading = document.getElementById('loading');
        const container = document.getElementById('doacoes-container');
        const noDonations = document.getElementById('no-donations');

        loading.style.display = 'block';
        container.innerHTML = '';
        noDonations.style.display = 'none';

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/doacoes/minhas', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                this.myDonations = await response.json();
                this.renderMyDonations();
            } else if (response.status === 401) {
                localStorage.removeItem('token');
                this.showAuthRequired();
                return;
            } else {
                throw new Error('Erro ao carregar suas doações');
            }
        } catch (error) {
            console.error('Erro:', error);
            this.showError('Erro ao carregar suas doações. Tente novamente.');
        } finally {
            loading.style.display = 'none';
        }
    }

    renderMyDonations() {
        const container = document.getElementById('doacoes-container');
        const noDonations = document.getElementById('no-donations');

        container.innerHTML = '';

        if (this.myDonations.length === 0) {
            noDonations.style.display = 'block';
            return;
        }

        noDonations.style.display = 'none';

        this.myDonations.forEach(donation => {
            const card = this.createMyDonationCard(donation);
            container.appendChild(card);
        });
    }

    createMyDonationCard(donation) {
        const card = document.createElement('div');
        card.className = 'donation-card';

        const formattedDate = new Date(donation.criadoEm).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const statusBadge = donation.ativo ? 
            '<span class="status-badge active">Ativa</span>' : 
            '<span class="status-badge inactive">Inativa</span>';

        card.innerHTML = `
            <div class="donation-header">
                <h3 class="donation-title">${donation.titulo || 'Sem título'}</h3>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    ${statusBadge}
                    ${donation.tipoAlimento ? `<span class="donation-type">${donation.tipoAlimento}</span>` : ''}
                </div>
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
                <div class="donation-date">
                    <i class="fas fa-clock"></i>
                    ${formattedDate}
                </div>
                <div class="donation-actions">
                    <button class="btn-edit" onclick="editDonation(${donation.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete" onclick="deleteDonation(${donation.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    calculateStats() {
        const totalDonations = this.myDonations.length;
        const activeDonations = this.myDonations.filter(d => d.ativo).length;
        const totalQuantity = this.myDonations.reduce((sum, d) => sum + (d.quantidade || 0), 0);

        document.getElementById('total-donations').textContent = totalDonations;
        document.getElementById('active-donations').textContent = activeDonations;
        document.getElementById('total-quantity').textContent = totalQuantity.toFixed(1);
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

// Funções globais para editar e excluir doações
async function editDonation(donationId) {
    // Implementar edição de doação
    alert(`Editar doação ${donationId} - Funcionalidade em desenvolvimento`);
}

async function deleteDonation(donationId) {
    if (confirm('Tem certeza que deseja excluir esta doação?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/doacoes/${donationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Doação excluída com sucesso!');
                location.reload(); // Recarregar a página para atualizar a lista
            } else {
                alert('Erro ao excluir doação');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir doação');
        }
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new MinhasDoacoesApp();
});
